import { Alert, Button, ScrollView, Text, View } from "react-native";
import { useState, useRef, useEffect } from "react";
import hgraphClient from "@/src/utils/hgraph-client";
import { RecentTransactions } from "@/src/gql";
import { Transaction } from "@/src/components";
import { ObservableSubscription } from "@hgraph.io/sdk";
import { TransactionRecord } from "@/src/types";

export default function TransactionsFeed() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [subscription, setSubscription] = useState<ObservableSubscription>();

  useEffect(() => {
    return () => {
      hgraphClient.removeAllSubscriptions();
    };
  }, []);

  const toggle = () => {
    if (subscription) {
      subscription.unsubscribe();
    } else {
      setSubscription(
        hgraphClient.subscribe(RecentTransactions, {
          // handle the data
          next: ({ data }: any) => {
            setTransactions(data.transactions ?? []);
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
    }
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
      <Button
        onPress={toggle}
        title={subscription ? "Stop live feed" : "Start live feed"}
      />

      {transactions?.map((transaction, index) => (
        <Transaction key={index} {...transaction} />
      ))}
    </ScrollView>
  );
}
