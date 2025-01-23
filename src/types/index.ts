import { AccountId, PrivateKey } from "@hashgraph/sdk";

export interface TransactionRecord {
  type: number;
  id: string;
  result: number;
  consensus_timestamp: bigint;
  charged_tx_fee: bigint;
}

export interface TokenTransferRecord {
  amount: bigint;
  payer_account_id: number;
  account_id: number;
  consensus_timestamp: bigint;
  token: {
    symbol: string;
    decimals: number;
  };
}

export interface NFTCollectionRecord {
  name: string;
  symbol: string;
  token_id: number;
  created_timestamp: bigint;
  treasury_account_id: number;
  nft: [
    {
      metadata: string;
      serial_number: number;
    },
  ];
}

export type NFTMetadata = {
  name: string;
  image: string | null;
};

export type HederaAccount = {
  accountId: AccountId;
  evmAddress: string;
  privateKey: PrivateKey;
};
