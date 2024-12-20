import "@/src/utils/polyfills";
import { Tabs } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

export default function AppLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          href: null,
        }}
      />
      <Tabs.Screen
        name="hedera-wallet-connect/index"
        options={{
          title: "Wallet",
          headerTitle: "HWC Wallet Demo",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="wallet" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="hgraph-sdk/transactions-feed"
        options={{
          title: "Recent Transactions",
          headerTitle: "Recent Transactions",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="history" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="hgraph-sdk/nft-collections-search"
        options={{
          title: "NFT Collections",
          headerTitle: "NFT Collections Search",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="images" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="hgraph-sdk/tokens-transfers-feed"
        options={{
          title: "Tokens Transfers",
          headerTitle: "Recent Fungible Tokens Transfers",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="exchange-alt" size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
