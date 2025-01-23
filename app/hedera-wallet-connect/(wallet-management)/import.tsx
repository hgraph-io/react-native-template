import React, { useState } from "react";
import { Button, Text, View, Alert } from "react-native";
import { importWalletAccount, saveMnemonic } from "@/src/utils/account";
import { Stack, useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import MnemonicInput from "@/src/components/MnemonicInput";
import { Mnemonic } from "@hashgraph/sdk";

export default function ImportWalletAccountPage() {
  const [mnemonicWords, setMnemonicWords] = useState<string[]>(
    Array(12).fill(""),
  );
  const router = useRouter();

  const pasteFromClipboard = async () => {
    const mnemonic = (await Clipboard.getStringAsync()).split(" ");
    if (mnemonic.length == 12) setMnemonicWords(mnemonic);
  };

  const importWallet = async () => {
    try {
      const mnemonic = await Mnemonic.fromWords(mnemonicWords);
      await importWalletAccount(mnemonic);
      await saveMnemonic(mnemonic);
      router.navigate("/hedera-wallet-connect");
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        "Failed to import wallet, check the mnemonic and try again.",
      );
    }
  };

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
          title: "Wallet Import",
        }}
      />
      <Text style={{ fontWeight: "bold" }}>
        Input mnemonic phrase to import your wallet
      </Text>
      <MnemonicInput
        mode="import"
        words={mnemonicWords}
        setWords={setMnemonicWords}
      />
      <Button title="Paste from Clipboard" onPress={pasteFromClipboard} />
      <Button
        disabled={mnemonicWords.some((word) => !word)}
        title="Import"
        onPress={importWallet}
      />
    </View>
  );
}
