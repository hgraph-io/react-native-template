import React, { useEffect, useState } from "react";
import { Button, Text, View, Alert } from "react-native";
import { getSavedMnemonic } from "@/src/utils/account";
import { Stack, useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import MnemonicInput from "@/src/components/MnemonicInput";

export default function ExportWalletAccountPage() {
  const [mnemonicWords, setMnemonicWords] = useState<string[]>();

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
      {mnemonicWords && (
        <>
          <Text style={{ fontWeight: "bold" }}>
            Keep the mnemonic phrase from your wallet in a safe place
          </Text>
          <MnemonicInput mode="readonly" words={mnemonicWords} />
          <Button
            title="Copy to Clipboard"
            onPress={() => Clipboard.setStringAsync(mnemonicWords?.join(" "))}
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
