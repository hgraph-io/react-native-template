import React, { useEffect, useState } from "react";
import { Button, Text, View, Alert } from "react-native";
import { getSavedMnemonic, importWalletAccount } from "@/src/utils/account";
import { Stack, useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import MnemonicInput from "@/src/components/MnemonicInput";
import { HederaAccount } from "@/src/types";

export default function ExportWalletAccountPage() {
  const [mnemonicWords, setMnemonicWords] = useState<string[]>();
  const [walletAccount, setWalletAccount] = useState<HederaAccount>();

  const router = useRouter();
  const loadMnemonic = async () => {
    const mnemonic = await getSavedMnemonic();
    if (!mnemonic) {
      Alert.alert(
        "Error",
        "No mnemonic found, please create a new wallet first.",
      );
      router.navigate("/hedera-wallet-connect");
    } else {
      const wallet = await importWalletAccount(mnemonic);
      setWalletAccount(wallet);
      setMnemonicWords(mnemonic.toString().split(" "));
    }
  };

  useEffect(() => {
    loadMnemonic();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        margin: 15,
        gap: 15,
      }}
    >
      <Stack.Screen
        options={{
          title: "Wallet Export",
        }}
      />
      {mnemonicWords && walletAccount && (
        <>
          <Text style={{ fontWeight: "bold" }}>
            Keep the mnemonic phrase & private key from your wallet in a safe place!
          </Text>
          <Text>
            Private Key: {"\n"}
            {walletAccount.privateKey.toStringDer()}
          </Text>
          <MnemonicInput mode="readonly" words={mnemonicWords} />

          <Button
            title="Copy Mnemonic"
            onPress={() => Clipboard.setStringAsync(mnemonicWords?.join(" "))}
          />
          <Button
            title="Copy Private Key"
            onPress={() =>
              Clipboard.setStringAsync(walletAccount.privateKey.toStringDer())
            }
          />
          <Button
            title="Done"
            onPress={() => router.navigate("/hedera-wallet-connect")}
          />
        </>
      )}
    </View>
  );
}
