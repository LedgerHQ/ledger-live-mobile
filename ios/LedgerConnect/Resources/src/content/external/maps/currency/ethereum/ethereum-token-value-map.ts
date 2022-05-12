import assert from 'assert';
import { isObjectLike } from '../../../../../library/typeguards';
import { EthereumTokenValue } from '../../../../domain/currency/ethereum/ethereum-token-value';
import { TokenValue } from '../../../../domain/currency/token-value';

export interface TokenValueAlchemyDTO {
  id: number;
  jsonrpc: string;
  result: string;
}

export function mapAlchemyDTOToDomain(dto: unknown): TokenValue {
  assert(isObjectLike<TokenValueAlchemyDTO>(dto), 'the alchemy token value dto must be an object');
  assert(typeof dto.result === 'string', 'token value result must be a string');
  return EthereumTokenValue.create({
    valueHex: dto.result,
    decimals: 18,
    symbol: 'ETH',
  });
}
