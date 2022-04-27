import assert from 'assert';
import { assertEnum, assertUnreachable, isObjectLike } from '../../../../../library/typeguards';
import { Chain } from '../../../../domain/chain';
import { DappRequest, EthereumMethod, RequestType } from '../../../../use-case/dto/dapp-request';
import * as EthereumTransactionRequestMap from '../../transaction/ethereum/ethereum-transaction-request-map';

export type EthereumRawDappRequestDTO =
  | {
      id: number;
      type: RequestType.ConnectDapp;
      method: EthereumMethod.ConnectDapp;
      payload: undefined;
      chain: Chain.Ethereum;
    }
  | {
      id: number;
      type: RequestType.SignAndSendTransaction;
      method: EthereumMethod.SignAndSendTransaction;
      payload: EthereumTransactionRequestMap.EthereumTransactionRequestDappDTO;
      chain: Chain.Ethereum;
    };

export function mapDappDTOToDomain(dto: unknown): DappRequest {
  assert(isObjectLike<EthereumRawDappRequestDTO>(dto), 'the dapp request dapp dto must be an object');
  assert(typeof dto.id === 'number', 'id must be a number');
  assert(
    typeof dto.payload === 'undefined' || isObjectLike<EthereumRawDappRequestDTO['payload']>(dto.payload),
    'payload must be an object or undefined',
  );
  assertEnum(dto.type, RequestType);
  assert(typeof dto.method === 'string', 'method must be a string');
  assertEnum(dto.chain, Chain);

  let value: DappRequest;

  switch (dto.method) {
    case EthereumMethod.ConnectDapp:
      value = DappRequest.create({
        id: dto.id,
        type: RequestType.ConnectDapp,
        method: EthereumMethod.ConnectDapp,
        payload: undefined,
        chain: Chain.Ethereum,
      });
      break;
    case EthereumMethod.SignAndSendTransaction:
      value = DappRequest.create({
        id: dto.id,
        type: RequestType.SignAndSendTransaction,
        method: EthereumMethod.SignAndSendTransaction,
        payload: EthereumTransactionRequestMap.mapDappDTOToDomain(dto.payload),
        chain: Chain.Ethereum,
      });
      break;
    default:
      assertUnreachable(dto.method);
  }

  return value;
}
