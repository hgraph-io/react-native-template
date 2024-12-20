import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NFTCollectionRecord, TransactionRecord } from "@/src/types";
import { SUCCESS_RESULT, transationTypeName } from "@/src/utils/transaction";
import { Hbar, HbarUnit } from "@hashgraph/sdk";
import { openTokenInExplorer } from "@/src/utils/network";
import NFTDisplay from "./NFTDisplay";

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
    flexWrap: "nowrap",
  },
  text: {
    fontSize: 14,
  },
  token: {
    flexBasis: "50%",
    color: "#0088FF",
  },
});

const NFTCollection = ({
  name,
  symbol,
  token_id,
  created_timestamp,
  treasury_account_id,
  nft,
}: NFTCollectionRecord) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => openTokenInExplorer(token_id)}
    >
      <View style={styles.row}>
        <Text style={[styles.text, styles.token]}>
          {name} ({symbol})
        </Text>

        <Text numberOfLines={1} style={[styles.text]}>
          0.0.{token_id}
        </Text>
      </View>
      <View style={styles.row}>
        <Text numberOfLines={1} style={[styles.text]}>
          Created by: 0.0.{treasury_account_id}
        </Text>
        <Text numberOfLines={1} style={[styles.text]}>
          {new Date(Number(created_timestamp) / 1e6).toLocaleString("en-US")}
        </Text>
      </View>
      {nft.map(({ metadata, serial_number }) => (
        <NFTDisplay
          key={serial_number}
          encodedMetadata={metadata}
          serialNumber={serial_number}
        />
      ))}
    </TouchableOpacity>
  );
};

export default NFTCollection;
