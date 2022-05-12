import assert from 'assert';
import { isObjectLike } from '../../../../../library/typeguards';
import { SignedTransaction } from '../../../../domain/transaction/ethereum/signed-transaction';

export type SignedTransactionNativeDTO = {
  id: number;
  method: string;
  value: string;
};

export function mapNativeDTOToDomain(dto: unknown): SignedTransaction {
  assert(isObjectLike<SignedTransactionNativeDTO>(dto), 'the signed transaction native dto must be an object');
  assert(typeof dto.value === 'string', 'signed transaction data must be a string');
  return SignedTransaction.create(dto.value);
}
