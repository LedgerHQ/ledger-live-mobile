import assert from 'assert';
import { isObjectLike } from '../../../../../library/typeguards';
import { TransactionHash } from '../../../../domain/transaction/ethereum/transaction-hash';

export interface TransactionHashAlchemyDTO {
  id: number;
  jsonrpc: string;
  result: string;
}

export function mapAlchemyDTOToDomain(dto: unknown): TransactionHash {
  assert(isObjectLike<TransactionHashAlchemyDTO>(dto), 'the alchemy transaction hash dto must be an object');
  assert(typeof dto.result === 'string', 'transaction hash result must be a string');
  return TransactionHash.create(dto.result);
}

export function mapDomainToDappDTO(transactionHash: TransactionHash): string {
  return transactionHash.getTransactionHashData();
}
