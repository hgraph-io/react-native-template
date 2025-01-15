# React Native @hgraph.io/sdk template

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Examples overview

The template contains several examples of using [@hgraph.io/sdk](https://www.npmjs.com/package/@hgraph.io/sdk) features, as well as an example of hedera wallet integration using [@hashgraph/hedera-wallet-connect](https://www.npmjs.com/package/@hashgraph/hedera-wallet-connect):

### Wallet

The entry point is at [app/hedera-wallet-connect/index.tsx](app/hedera-wallet-connect/index.tsx)
This demo example of integration [@hashgraph/hedera-wallet-connect](https://www.npmjs.com/package/@hashgraph/hedera-wallet-connect) with React Native.

Allows the hedera wallet to connect to the DApp via the WalletConnect protocol and execute requests from the DApp, such as signing messages and transactions, executing requests and transactions, etc. in accordance with [HIP-820](https://hips.hedera.com/hip/hip-820).

You can create a testnet wallet using the [Hedera portal](https://portal.hedera.com/dashboard).

To use the example, please create a project in [Reown Cloud](https://cloud.reown.com) and fill in the variables in .env.

A demo version of the DApp is available [here](https://hwc-docs.hgraph.app/demos).

### Recent Transactions Feed

The entry point is at [app/hgraph-sdk/transactions-feed.tsx](app/hgraph-sdk/transactions-feed.tsx)

Example of subscribing and displaying recent transactions as a live feed with a readable type and transaction success highlighting using [@hgraph.io/sdk](https://www.npmjs.com/package/@hgraph.io/sdk)
GraphQL subscription placed on [src/gql/RecentTransactions.gql](src/gql/RecentTransactions.gql)


### NFT Collections Search

The entry point is at [app/hgraph-sdk/nft-collections-search.tsx](app/hgraph-sdk/nft-collections-search.tsx)

Example of searching NFT collections by symbol (partial case-insensitive search) using [@hgraph.io/sdk](https://www.npmjs.com/package/@hgraph.io/sdk). Used debounce and abort controller mechanics for correct search in real time. Also displaying one NFT for each collection with an image, with simple decoded from ipfs metadata (if available) with animations supported. 
GraphQL query placed on [src/gql/SearchNFTCollection.gql](src/gql/SearchNFTCollection.gql)

### Recent Tokens Transfers Feed

The entry point is at [app/hgraph-sdk/tokens-transfers-feed.tsx](app/hgraph-sdk/tokens-transfers-feed.tsx)

Example of subscribing and displaying recent transfers for fungible tokens as a live feed using [@hgraph.io/sdk](https://www.npmjs.com/package/@hgraph.io/sdk). 
GraphQL subscription placed on [src/gql/RecentTokensTransfers.gql](src/gql/RecentTokensTransfers.gql)


## Useful recources

- [WalletConnect <> Hedera documentation →](https://hwc-docs.hgraph.app/)
- [Hedera portal →](https://portal.hedera.com/dashboard)
- [Reown Cloud →](https://cloud.reown.com)
- [Hgraph SDK documentation →](https://docs.hgraph.com/category/hgraph-sdk)
- [About the GraphQL API →](https://docs.hgraph.com/graphql-api/subscriptions)
- [About GraphQL subscriptions →](https://docs.hgraph.com/graphql-api/subscriptions)
- [Expo documentation →](https://docs.expo.dev/)
- [Learn Expo tutorial →](https://docs.expo.dev/tutorial/introduction/)

## Get started

1. Install dependencies

   ```bash
   yarn install
   ```

2. Seup env vars

   ```bash
   cp .env.example .env
   ```

2. Start the app

   ```bash
    yarn start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).