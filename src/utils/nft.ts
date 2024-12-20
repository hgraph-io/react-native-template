import { NFTMetadata } from "../types";

export async function decodeNFTMetadataIpfs(metadataHex: string): Promise<NFTMetadata | null> {
  const ipfsPrefix = "ipfs://";
  const ipfsGateway = "https://gateway.pinata.cloud/ipfs/";

  const metadataUrl = Buffer.from(metadataHex.slice(2), "hex").toString();
  if (!metadataUrl.startsWith(ipfsPrefix)) {
    return null;
  }

  const ipfsUrl = metadataUrl.replace(ipfsPrefix, ipfsGateway);
  try {
    const response = await fetch(ipfsUrl);
    if (!response.ok) {
      return null;
    }
    const metadata = await response.json();
    const { name, image } = metadata;
    if (!name || !image) {
      return null;
    }
    const resolvedImage = image.startsWith(ipfsPrefix)
      ? image.replace(ipfsPrefix, ipfsGateway)
      : null;

    return { name, image: resolvedImage };
  } catch (error) {
    return null;
  }
}