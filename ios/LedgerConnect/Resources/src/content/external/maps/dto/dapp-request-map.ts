import assert from 'assert';
import { assertEnum, assertUnreachable, isObjectLike } from '../../../../library/typeguards';
import { Chain } from '../../../domain/chain';
import { DappRequest } from '../../../use-case/dto/dapp-request';
import * as EthereumDappRequestMap from './chain/ethereum-dapp-request-map';
import * as SolanaDappRequestMap from './chain/solana-dapp-request-map';

export type RawDappRequestDTO =
  | EthereumDappRequestMap.EthereumRawDappRequestDTO
  | SolanaDappRequestMap.SolanaRawDappRequestDTO;

export function mapDappDTOToDomain(dto: unknown): DappRequest {
  assert(isObjectLike<RawDappRequestDTO>(dto), 'the dapp request dapp dto must be an object');
  assertEnum(dto.chain, Chain);

  let value: DappRequest;

  switch (dto.chain) {
    case Chain.Ethereum:
      value = EthereumDappRequestMap.mapDappDTOToDomain(dto);
      break;
    case Chain.Solana:
      value = SolanaDappRequestMap.mapDappDTOToDomain(dto);
      break;
    default:
      assertUnreachable(dto.chain);
  }

  return value;
}
