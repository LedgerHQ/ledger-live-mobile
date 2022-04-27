import assert from 'assert';
import { isObjectLike } from '../../../../library/typeguards';
import { Account } from '../../../domain/ledger/account';

export type AccountsNativeDTO = {
  id: number;
  value: string[];
};

export function mapNativeDTOToDomain(dto: unknown): Account[] {
  assert(isObjectLike<AccountsNativeDTO>(dto), `the accounts native dto must be an object but got ${dto}`);
  assert(Array.isArray(dto.value), 'accounts value must be an array of string');
  return dto.value.map((accountValue) => Account.create(accountValue));
}

export function mapDomainToDappDTO(accounts: Account[]): string[] {
  return accounts.map((account) => account.getValue());
}
