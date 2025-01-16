import { Button, Text, Alert, TextInput, ScrollView } from "react-native";
import type { Web3WalletTypes } from "@walletconnect/web3wallet";
import { getSdkError } from "@walletconnect/utils";
import { Wallet } from "@hashgraph/hedera-wallet-connect";
import { Stack, usePathname, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { currentNetwork } from "@/src/utils/network";
import { HederaAccount } from "@/src/types";
import {
  deleteWalletAccount,
  getSavedMnemonic,
  importWalletAccount,
} from "@/src/utils/account";

export default function WalletPage() {
  const [logState, setLog] = useState("");
  const [web3wallet, setWeb3Wallet] = useState<Wallet>();
  const [walletAccount, setWalletAccount] = useState<HederaAccount | null>();
  const [pairUrl, onChangeUrl] = React.useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const path = usePathname();

  useEffect(() => {
    if (path !== "/hedera-wallet-connect") return;
    if (!walletAccount) initWalletAccount();
  }, [path]);

  useEffect(() => {
    if (walletAccount !== null && !web3wallet) {
      initWalletConnect();
    }
  }, [walletAccount, web3wallet]);

  const initWalletAccount = async () => {
    setIsLoading(true);
    const mnemonic = await getSavedMnemonic();
    if (mnemonic) {
      const account = await importWalletAccount(mnemonic);
      setWalletAccount(account);
    } else {
      setWalletAccount(null);
    }
    setIsLoading(false);
  };

  const deleteWallet = async () => {
    await disconnect();
    deleteWalletAccount();
    setLog("");
    setWalletAccount(null);
    setWeb3Wallet(undefined);
  };

  const confirm = (message: string) =>
    new Promise((resolve) =>
      Alert.alert("Confirm", message, [
        {
          text: "Reject",
          onPress: () => resolve(false),
          style: "cancel",
        },
        { text: "OK", onPress: () => resolve(true) },
      ]),
    );

  function log(message: string) {
    console.log(message);
    setLog((currentLog) => currentLog + "\n" + message);
  }

  async function initWalletConnect() {
    if (web3wallet) return;
    const projectId = process.env.EXPO_PUBLIC_WC_PROJECT_ID!;
    const metadata: Web3WalletTypes.Metadata = {
      name: process.env.EXPO_PUBLIC_WC_NAME!,
      description: process.env.EXPO_PUBLIC_WC_DESCRIPTION!,
      url: process.env.EXPO_PUBLIC_WC_URL!,
      icons: [process.env.EXPO_PUBLIC_WC_ICON!],
    };

    const wallet = await Wallet.create(projectId, metadata);
    setWeb3Wallet(wallet);
    /*
     * Add listeners
     */

    // called after pairing to set parameters of session, i.e. accounts, chains, methods, events
    wallet.on(
      "session_proposal",
      async (proposal: Web3WalletTypes.SessionProposal) => {
        const accountId = walletAccount?.accountId.toString();
        const chainId = `hedera:${currentNetwork}`;
        const accounts: string[] = [`${chainId}:${accountId}`];

        if (
          await confirm(
            `Do you want to connect to this session?: ${JSON.stringify(
              proposal,
            )}`,
          )
        )
          wallet!.buildAndApproveSession(accounts, proposal);
        else
          await wallet!.rejectSession({
            id: proposal.id,
            reason: getSdkError("USER_REJECTED_METHODS"),
          });
      },
    );

    // requests to call a JSON-RPC method
    wallet.on(
      "session_request",
      async (event: Web3WalletTypes.SessionRequest) => {
        try {
          const { chainId, accountId } = wallet!.parseSessionRequest(event);

          if (
            !(await confirm(
              `Do you want to proceed with this request?: ${JSON.stringify(
                event,
              )}`,
            ))
          )
            throw getSdkError("USER_REJECTED_METHODS");

          const hederaWallet = wallet!.getHederaWallet(
            chainId,
            accountId || process.env.EXPO_PUBLIC_ACCOUNT_ID!,
            process.env.EXPO_PUBLIC_PRIVATE_KEY!,
          );

          return await wallet!.executeSessionRequest(event, hederaWallet);
        } catch (e) {
          const error = e as { message: string; code: number };
          log("Error: " + error.message);
          wallet!.rejectSessionRequest(event, error);
        }
      },
    );

    wallet.on("session_delete", () => {
      // Session was deleted
      log("Wallet: Session deleted by dapp!");
    });

    wallet.core.pairing.events.on("pairing_delete", (pairing: string) => {
      // Session was deleted
      log(pairing);
      log(`Wallet: Pairing deleted by dapp!`);
    });

    log("Wallet: WalletConnect initialized!");
  }

  async function pair(uri: string) {
    web3wallet!.core.pairing.pair({ uri });
  }

  async function disconnect() {
    //https://docs.walletconnect.com/web3wallet/wallet-usage#session-disconnect
    for (const session of Object.values(web3wallet!.getActiveSessions())) {
      log(`Disconnecting from session: ${session}`);
      await web3wallet!.disconnectSession({
        // @ts-ignore
        topic: session.topic,
        reason: getSdkError("USER_DISCONNECTED"),
      });
    }
    for (const pairing of web3wallet!.core.pairing.getPairings()) {
      log(`Disconnecting from pairing: ${pairing}`);
      await web3wallet!.disconnectSession({
        topic: pairing.topic,
        reason: getSdkError("USER_DISCONNECTED"),
      });
    }
  }

  return (
    <ScrollView
      style={{
        flex: 1,
      }}
      contentContainerStyle={{
        rowGap: 20,
        margin: 15,
        alignItems: "center",
      }}
    >
      <Stack.Screen
        options={{
          title: "Hedera WalletConnect Example",
        }}
      />
      <Text>
        Example of integration @hashgraph/hedera-wallet-connect with React
        Native. Allows the hedera wallet to connect to the DApp via the
        WalletConnect protocol and execute requests from the DApp.
      </Text>
      {isLoading && <Text>Loading...</Text>}
      {!isLoading && !!walletAccount && (
        <>
          <Text>Wallet Account Id: {walletAccount.accountId.toString()}</Text>
          <TextInput
            style={{
              height: 40,
              width: "50%",
              borderWidth: 1,
              padding: 10,
            }}
            onChangeText={onChangeUrl}
            value={pairUrl}
            placeholder="Pair URI"
          />
          <Button
            disabled={!pairUrl}
            title="Pair"
            onPress={() => pair(pairUrl)}
          />
          <Button title="Disconnect" onPress={disconnect} />
          <Button
            title="Export Wallet"
            onPress={() => router.navigate("/hedera-wallet-connect/export")}
          />
          <Button title="Delete Wallet" onPress={deleteWallet} />
          <Text>{logState}</Text>
        </>
      )}
      {!isLoading && walletAccount === null && (
        <>
          <Text style={{ fontWeight: "bold" }}>
            Wallet not created, please create or import a wallet
          </Text>
          <Button
            title="Create wallet"
            onPress={() => router.navigate("/hedera-wallet-connect/create")}
          />
          <Button
            title="Import wallet"
            onPress={() => router.navigate("/hedera-wallet-connect/import")}
          />
        </>
      )}
    </ScrollView>
  );
}
