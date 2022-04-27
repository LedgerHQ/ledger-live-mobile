import { DappResponse } from '../../../use-case/dto/dapp-response';
import { Chain } from '../../../domain/chain';
import * as EthereumDappResponseMap from './chain/ethereum-dapp-response-map';
import * as SolanaDappResponseMap from './chain/solana-dapp-response-map';
import { assertUnreachable } from '../../../../library/typeguards';

export type RawDappResponseDTO =
  | EthereumDappResponseMap.EthereumRawDappResponseDTO
  | SolanaDappResponseMap.SolanaRawDappResponseDTO;

export function mapDomainToDappDTO(response: DappResponse): RawDappResponseDTO {
  const chain = response.getChain();

  let value: RawDappResponseDTO;

  switch (chain) {
    case Chain.Ethereum:
      value = EthereumDappResponseMap.mapDomainToDappDTO(response);
      break;
    case Chain.Solana:
      value = SolanaDappResponseMap.mapDomainToDappDTO(response);
      break;
    default:
      assertUnreachable(chain);
  }

  return value;
}
