const mirrorNodeApiUrl = `https://${process.env.EXPO_PUBLIC_NETWORK}.mirrornode.hedera.com`;

export async function getAccounts(publickey: string) {
  const url = `${mirrorNodeApiUrl}/api/v1/accounts?account.publickey=${publickey}`;
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
    },
    method: "GET",
  });

  if (response.status !== 200) {
    console.error(await response.text());
    throw new Error("Mirror node fetch fail");
  }
  const { accounts } = await response.json();
  return accounts;
}
