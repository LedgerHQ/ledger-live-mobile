import { Chain } from '../chain';
import { Account } from './account';

export interface AccountStore {
  storeAccount(account: Account, chain: Chain): void;
  getAccount(chain: Chain): Account | undefined;
}
