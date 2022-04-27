import assert from 'assert';
import { assertArrayOfString, isObjectLike } from '../../../../../library/typeguards';
import { SolanaTransactionRequest } from '../../../../domain/transaction/solana/solana-transaction-request';
import * as TransactionMap from './transaction-map';
import * as PublicKeyMap from './public-key-map';

export interface SolanaTransactionRequestDappDTO {
  serializedTransactionsHex: string[];
  publicKeyBase58: string;
}

export function mapDappDTOToDomain(dto: unknown): SolanaTransactionRequest {
  assert(isObjectLike<SolanaTransactionRequestDappDTO>(dto), 'the solana transaction request dto must be an object');
  assertArrayOfString(dto.serializedTransactionsHex);
  assert(typeof dto.publicKeyBase58 === 'string', 'publicKeyBase58 must be a string');

  return SolanaTransactionRequest.create({
    transactions: dto.serializedTransactionsHex.map((transaction) => TransactionMap.mapDappDTOToDomain(transaction)),
    publicKey: PublicKeyMap.mapDappDTOToDomain(dto.publicKeyBase58),
  });
}
