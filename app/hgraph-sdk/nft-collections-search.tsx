import { Alert, ScrollView, Text, TextInput, View } from "react-native";
import { useState, useRef, useCallback, useEffect } from "react";
import hgraphClient from "@/src/utils/hgraph-client";
import debounce from "@/src/utils/debounce";
import { SearchNFTCollection } from "@/src/gql";
import { NFTCollectionRecord } from "@/src/types";
import { NFTCollection } from "@/src/components";

export default function NftCollectionsSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [nftCollections, setNftCollections] = useState<NFTCollectionRecord[]>();

  const abortController = useRef<AbortController>();

  const searchNftCollections = async (symbol: string) => {
    abortController.current?.abort();
    abortController.current = new AbortController();
    setLoading(true);
    try {
      const result = await hgraphClient.query<{
        collections: NFTCollectionRecord[];
      }>(
        {
          query: SearchNFTCollection,
          variables: {
            symbol: `${symbol}%`,
          },
        },
        abortController.current.signal,
      );
      if (result.errors) {
        Alert.alert(
          "Query error",
          result.errors.map((error: Error) => error.message).join("\n"),
        );
      } else {
        setNftCollections(result.data?.collections ?? []);
      }
    } catch (error) {}
    setLoading(false);
  };

  const debouncedSearch = useCallback(debounce(searchNftCollections, 500), []);

  useEffect(() => {
    searchNftCollections(query);
  }, []);

  const handleSearch = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  return (
    <ScrollView
      style={{
        flex: 1,
      }}
      contentContainerStyle={{
        rowGap: 10,
        margin: 15,
        paddingBottom: 15,
      }}
    >
      <Text>
        Example of searching NFT collections by its symbol (сase-insensitive
        partial search). Used debounce and abort controller mechanics for
        correct search in real time. Also displaying one NFT for each collection
        with an image, with simple decoded from ipfs metadata (if available)
        with animations supported. GraphQL query placed on
        <Text style={{ color: "#0088FF" }}>
          {" "}
          src/gql/SearchNFTCollection.gql
        </Text>
      </Text>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 16,
          paddingHorizontal: 8,
          borderRadius: 4,
        }}
        placeholder="NFT Symbol..."
        value={query}
        onChangeText={handleSearch}
      />
      {loading && <Text>Loading...</Text>}
      {nftCollections?.map((collection, index) => (
        <NFTCollection key={index} {...collection} />
      ))}
    </ScrollView>
  );
}
