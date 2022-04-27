import { TokenStore } from '../../../domain/currency/token-store';
import { TokenValue } from '../../../domain/currency/token-value';
import { Account } from '../../../domain/ledger/account';

export class EthereumTokenStore implements TokenStore {
  public async getNativeTokenValue(account: Account): Promise<TokenValue> {
    return TokenValue.create({ valueHex: '0x1111D67BB1BB0000', decimals: 18, symbol: 'ETH' });
  }
}
