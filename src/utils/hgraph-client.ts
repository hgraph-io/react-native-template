import Client, { Environment, Network } from "@hgraph.io/sdk";
import { currentNetwork } from "./network";

// Hgraph client configuration
const client = new Client({
  network: currentNetwork === "testnet" ? Network.HederaTestnet : Network.HederaMainnet,
  environment: Environment.Production,
  token: undefined, // jwt
  headers: {},
  patchBigIntToJSON: true,
});

export default client;