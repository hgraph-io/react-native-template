import { Text, View } from "react-native";
import React from "react";

export default function HomePage() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 50,
      }}
    >
      <Text style={{ fontSize: 16, lineHeight: 25, textAlign: "center" }}>
        Example template of {"\n"} @hgraph.io/sdk and hedera-wallet-connect
        {"\n"} integrating with React Native.{"\n"} Use the tabs at the bottom
        to navigate to the examples.
      </Text>
    </View>
  );
}
