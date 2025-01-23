import {
  PublicKey,
  AccountCreateTransaction,
  Client,
  Mnemonic,
  AccountId,
} from "@hashgraph/sdk";
import * as SecureStore from "expo-secure-store";
import { HederaAccount } from "../types";

const mnemonicStorageKey = "wallet-mnemonic";

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

    const evmAddress = publicKey.toEvmAddress();
    const accountId = AccountId.fromEvmAddress(0, 0, evmAddress);

    return {
      accountId,
      evmAddress,
      privateKey,
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
}
