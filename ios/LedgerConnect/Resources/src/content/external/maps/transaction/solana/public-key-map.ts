import { PublicKey } from '@solana/web3.js';

export function mapDappDTOToDomain(publicKeyBase58: string): PublicKey {
  return new PublicKey(publicKeyBase58);
}
