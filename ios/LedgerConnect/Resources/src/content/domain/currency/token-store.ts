import { Account } from '../ledger/account';
import { TokenValue } from './token-value';

export interface TokenStore {
  getNativeTokenValue(account: Account): Promise<TokenValue>;
}
