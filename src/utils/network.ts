import { Linking } from "react-native";

const currentNetwork =
  process.env.EXPO_PUBLIC_NETWORK === "testnet" ? "testnet" : "mainnet";

const openTransactionInExplorer = (id: string) => {
  const url = `https://hashscan.io/${currentNetwork}/transaction/${id}`;
  Linking.openURL(url);
};

const openTokenInExplorer = (id: number) => {
  const url = `https://hashscan.io/${currentNetwork}/token/0.0.${id}`;
  Linking.openURL(url);
};

export { currentNetwork, openTransactionInExplorer, openTokenInExplorer };
