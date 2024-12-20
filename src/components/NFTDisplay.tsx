import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { decodeNFTMetadataIpfs } from "@/src/utils/nft";
import { NFTMetadata } from "@/src/types";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  frame: {
    width: 100,
    height: 100,
    padding: 2,
    borderWidth: 0.5,
    borderColor: "#AAA",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    fontSize: 28,
  },
  name: {
    fontSize: 14,
    color: "#888",
  },
});

type NFTProps = {
  encodedMetadata: string;
  serialNumber: number;
};

const NFTDisplay = ({ encodedMetadata, serialNumber }: NFTProps) => {
  const [nftMetadata, setNftMetadata] = useState<NFTMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      setLoading(true);
      const metadata = await decodeNFTMetadataIpfs(encodedMetadata);
      setNftMetadata(metadata);
      setLoading(false);
    };

    fetchMetadata();
  }, [encodedMetadata]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{`#${serialNumber} ${
        nftMetadata?.name ?? "Unknown NFT"
      }`}</Text>
      <View style={styles.frame}>
        {nftMetadata?.image ? (
          <Image
            source={{ uri: nftMetadata.image }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.placeholder}>?</Text>
        )}
      </View>
    </View>
  );
};

export default NFTDisplay;
