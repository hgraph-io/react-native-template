import { Alert, Button, ScrollView, Text } from "react-native";
import { useState, useEffect } from "react";
import hgraphClient from "@/src/utils/hgraph-client";
import { RecentTokensTransfers } from "@/src/gql";
import { TokenTransfer } from "@/src/components";
import { ObservableSubscription } from "@hgraph.io/sdk";
import { TokenTransferRecord } from "@/src/types";

export default function TokensTransfersFeed() {
  const [transfers, setTransfers] = useState<TokenTransferRecord[]>([]);
  const [subscription, setSubscription] = useState<ObservableSubscription>();

  useEffect(() => {
    return () => {
      hgraphClient.removeAllSubscriptions();
    };
  }, []);

  const toggleSubscription = () => {
    if (subscription) {
      subscription.unsubscribe();
      return;
    }
    setSubscription(
      hgraphClient.subscribe(RecentTokensTransfers, {
        // handle the data
        next: ({ data }: any) => {
          setTransfers(data.transfers ?? []);
        },
        error: (errors) => {
          Alert.alert(
            "Subscription error",
            errors.map((error: Error) => error.message).join("\n"),
          );
          console.error(errors);
          setSubscription(undefined);
        },
        complete: () => {
          setSubscription(undefined);
        },
      }),
    );
  };

  return (
    <ScrollView
      style={{
        flex: 1,
      }}
      contentContainerStyle={{
        rowGap: 10,
        margin: 15,
      }}
    >
      <Text>
        Example of subscribing and displaying recent transfers for fungible
        tokens as a live feed using @hgraph.io/sdk. GraphQL subscription placed
        on
        <Text style={{ color: "#0088FF" }}>
          {" "}
          src/gql/RecentTokensTransfers.gql
        </Text>
      </Text>
      <Button
        onPress={toggleSubscription}
        title={subscription ? "Stop live feed" : "Start live feed"}
      />

      {transfers?.map((transfer, index) => (
        <TokenTransfer key={index} {...transfer} />
      ))}
    </ScrollView>
  );
}
