import {
  PublicKey,
  AccountCreateTransaction,
  Client,
  Mnemonic,
  AccountId,
} from "@hashgraph/sdk";
import * as SecureStore from "expo-secure-store";
import { getAccounts } from "./mirror-node";
import { HederaAccount } from "../types";

const mnemonicStorageKey = "wallet-mnemonic";

export const getOrCreateAccount = async (publicKey: PublicKey) => {
  const existAccounts = await getAccounts(publicKey.toStringRaw());

  if (existAccounts.length > 0) {
    const existAccount = existAccounts[0];
    return {
      accountId: AccountId.fromString(existAccount.account),
      evmAddress: existAccount.evm_address as string,
    };
  }

  const client = Client.forName(process.env.EXPO_PUBLIC_NETWORK!).setOperator(
    process.env.EXPO_PUBLIC_OPERATOR_ID!,
    process.env.EXPO_PUBLIC_OPERATOR_KEY!,
  );

  const evmAddress = publicKey.toEvmAddress();

  let transaction = await new AccountCreateTransaction()
    .setKey(publicKey)
    .setAlias(evmAddress)
    .signWithOperator(client);

  const response = await transaction.execute(client);
  const receipt = await response.getReceipt(client);

  if (!receipt.accountId) {
    throw new Error("Failed to create account");
  }

  return {
    accountId: receipt.accountId,
    evmAddress,
  };
};

export async function saveMnemonic(mnemonic: Mnemonic) {
  await SecureStore.setItemAsync(mnemonicStorageKey, mnemonic.toString());
}

export async function getSavedMnemonic(): Promise<Mnemonic | undefined> {
  const mnemonic = await SecureStore.getItemAsync(mnemonicStorageKey);
  if (!mnemonic) return;
  return Mnemonic.fromString(mnemonic);
}

export async function deleteWalletAccount() {
  return SecureStore.deleteItemAsync(mnemonicStorageKey);
}

export async function importWalletAccount(
  mnemonic: Mnemonic,
): Promise<HederaAccount> {
  try {
    const privateKey = await mnemonic.toStandardECDSAsecp256k1PrivateKey();
    const publicKey = privateKey.publicKey;

    const accountInfo = await getOrCreateAccount(publicKey);
    return {
      ...accountInfo,
      privateKey,
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
}
