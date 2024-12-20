import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TokenTransferRecord } from "@/src/types";
import { openTransactionInExplorer } from "@/src/utils/network";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderColor: "#AAA",
  },
  text: {
    fontSize: 14,
  },
  accounts: {
    textAlign: "left",
    flexBasis: "50%",
    flexDirection: "row",
  },
  tokenAmount: {
    textAlign: "right",
    flexBasis: "10%",
    color: "#FF4D4D",
    paddingRight: 5,
  },
  tokenSymbol: {
    textAlign: "left",
    flexBasis: "20%",
    color: "#0088FF",
  },
  date: {
    fontSize: 12,
    flexBasis: "20%",
    color: "#888",
    textAlign: "right",
  },
});

const TokenTransfer = ({
  payer_account_id,
  amount,
  token,
  account_id,
  consensus_timestamp,
}: TokenTransferRecord) => {
  const formattedAmount = (
    Number(amount) /
    10 ** token.decimals
  ).toLocaleString("en-US", { notation: "compact" });
  const consensusId = consensus_timestamp
    .toString()
    .replace(/.{10}/, (m) => m + ".");
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => openTransactionInExplorer(consensusId)}
    >
      <View style={styles.accounts}>
        <Text style={[styles.text]}>{`0.0.${payer_account_id}`}</Text>
        <Text style={[styles.text]}>→</Text>
        <Text style={[styles.text]}>{`0.0.${account_id}`}</Text>
      </View>
      <Text numberOfLines={1} style={[styles.text, styles.tokenAmount]}>
        {formattedAmount}
      </Text>
      <Text numberOfLines={1} style={[styles.text, styles.tokenSymbol]}>
        {token.symbol}
      </Text>
      <Text numberOfLines={1} style={[styles.text, styles.date]}>
        {new Date(Number(consensus_timestamp) / 1e6).toLocaleTimeString(
          "en-US",
        )}
      </Text>
    </TouchableOpacity>
  );
};

export default TokenTransfer;
