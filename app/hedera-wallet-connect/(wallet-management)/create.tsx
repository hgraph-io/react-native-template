import React, { useEffect, useState } from "react";
import { Button, Text, View, Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { Mnemonic } from "@hashgraph/sdk";
import MnemonicInput from "@/src/components/MnemonicInput";
import { saveMnemonic } from "@/src/utils/account";

export default function CreateWalletAccountPage() {
  const [mnemonic, setMnemonic] = useState<string[]>();
  const [verifyMnemonic, setVerifyMnemonic] = useState<string[]>();
  const [verifyIndices, setVerifyIndices] = useState<number[]>([]);

  const [mode, setMode] = useState<"readonly" | "verify">("readonly");
  const router = useRouter();

  useEffect(() => {
    Mnemonic.generate12()
      .then((mnemonic) => setMnemonic(mnemonic.toString().split(" ")))
      .catch((error) => console.error(error));
  }, []);

  const startVerify = () => {
    if (!mnemonic) return;
    setMode("verify");

    // erase 4 random words
    const erasedIndices = [...mnemonic?.keys()]
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);

    setVerifyIndices(erasedIndices);

    setVerifyMnemonic(
      mnemonic.map((word, index) =>
        erasedIndices.includes(index) ? "" : word,
      ),
    );
  };

  const confirmVerify = async () => {
    if (!mnemonic) return;

    try {
      if (verifyMnemonic?.join(" ") != mnemonic?.join(" ")) {
        Alert.alert("Error", "Mnemonics do not match.");
        return;
      }
      await saveMnemonic(await Mnemonic.fromWords(mnemonic));
      router.navigate("/hedera-wallet-connect");
    } catch (e) {
      console.error(e);
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
          title: mode == "readonly" ? "Wallet Creation" : "Verify Mnemonic",
        }}
      />
      {mode == "readonly" && mnemonic && (
        <>
          <Text style={{ fontWeight: "bold" }}>
            Keep the mnemonic phrase from your wallet in a safe place
          </Text>
          <MnemonicInput mode="readonly" words={mnemonic} />
          <Button
            title="Copy to Clipboard"
            onPress={() => Clipboard.setStringAsync(mnemonic.join(" "))}
          />
          <Button title="Continue" onPress={startVerify} />
        </>
      )}
      {mode == "verify" && verifyMnemonic && (
        <>
          <Text style={{ fontWeight: "bold" }}>
            Input missing words of your mnemonic
          </Text>
          <MnemonicInput
            mode="verify"
            words={verifyMnemonic}
            setWords={setVerifyMnemonic}
            verifyIndices={verifyIndices}
          />
          <Button
            disabled={verifyMnemonic.some((word) => !word)}
            title="Confirm"
            onPress={confirmVerify}
          />
        </>
      )}
    </View>
  );
}
