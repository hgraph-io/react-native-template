import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TransactionRecord } from "@/src/types";
import { SUCCESS_RESULT, transationTypeName } from "@/src/utils/transaction";
import { Hbar, HbarUnit } from "@hashgraph/sdk";
import { openTransactionInExplorer } from "@/src/utils/network";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderColor: "#AAA",
    gap: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 14,
  },
  failure: {
    color: "#FF0000",
  },
  id: {
    color: "#0088FF",
  },
});

const Transaction = ({
  id,
  consensus_timestamp,
  type,
  result,
  charged_tx_fee,
}: TransactionRecord) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => openTransactionInExplorer(id)}
    >
      <View style={styles.row}>
        <Text
          numberOfLines={1}
          style={[styles.text, result != SUCCESS_RESULT ? styles.failure : {}]}
        >
          {transationTypeName[type] ?? "Unknown"}
        </Text>
        <Text numberOfLines={1} style={[styles.text]}>
          Fee: {Hbar.fromTinybars(charged_tx_fee).toString(HbarUnit.Hbar)}
        </Text>
      </View>
      <View style={styles.row}>
        <Text numberOfLines={1} style={[styles.text, styles.id]}>
          {id}
        </Text>
        <Text numberOfLines={1} style={[styles.text]}>
          {new Date(Number(consensus_timestamp) / 1e6).toLocaleTimeString(
            "en-US",
          )}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Transaction;
