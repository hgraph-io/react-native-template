import { Button, Text, View, Alert, TextInput } from "react-native";
import type { Web3WalletTypes } from "@walletconnect/web3wallet";
import { getSdkError } from "@walletconnect/utils";
import { Wallet } from "@hashgraph/hedera-wallet-connect";
import React, { useState, useEffect } from "react";
import { currentNetwork } from "@/src/utils/network";

export default function WalletPage() {
  const [logState, setLog] = useState("");
  const [wallet, setWallet] = useState<Wallet>();
  const [pairUrl, onChangeUrl] = React.useState("");

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

  async function init() {
    const projectId = process.env.EXPO_PUBLIC_WC_PROJECT_ID!;
    const metadata: Web3WalletTypes.Metadata = {
      name: process.env.EXPO_PUBLIC_WC_NAME!,
      description: process.env.EXPO_PUBLIC_WC_DESCRIPTION!,
      url: process.env.EXPO_PUBLIC_WC_URL!,
      icons: [process.env.EXPO_PUBLIC_WC_ICON!],
    };

    const wallet = await Wallet.create(projectId, metadata);
    setWallet(wallet);
    /*
     * Add listeners
     */

    // called after pairing to set parameters of session, i.e. accounts, chains, methods, events
    wallet.on(
      "session_proposal",
      async (proposal: Web3WalletTypes.SessionProposal) => {
        const accountId = process.env.EXPO_PUBLIC_ACCOUNT_ID!;
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
    wallet!.core.pairing.pair({ uri });
  }

  async function disconnect() {
    //https://docs.walletconnect.com/web3wallet/wallet-usage#session-disconnect
    for (const session of Object.values(wallet!.getActiveSessions())) {
      log(`Disconnecting from session: ${session}`);
      await wallet!.disconnectSession({
        // @ts-ignore
        topic: session.topic,
        reason: getSdkError("USER_DISCONNECTED"),
      });
    }
    for (const pairing of wallet!.core.pairing.getPairings()) {
      log(`Disconnecting from pairing: ${pairing}`);
      await wallet!.disconnectSession({
        topic: pairing.topic,
        reason: getSdkError("USER_DISCONNECTED"),
      });
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        gap: 20,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TextInput
        style={{
          height: 40,
          width: "50%",
          margin: 12,
          borderWidth: 1,
          padding: 10,
        }}
        onChangeText={onChangeUrl}
        value={pairUrl}
        placeholder="Pair URI"
      />
      <Button disabled={!pairUrl} title="Pair" onPress={() => pair(pairUrl)} />
      <Button title="Disconnect" onPress={disconnect} />
      <Text>{logState}</Text>
    </View>
  );
}
