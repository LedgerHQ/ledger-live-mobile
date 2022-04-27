import assert from 'assert';
import { assertEnum, assertUnreachable, isObjectLike } from '../../../../../library/typeguards';
import { Chain } from '../../../../domain/chain';
import { DappRequest, RequestType, SolanaMethod } from '../../../../use-case/dto/dapp-request';
import * as SolanaTransactionRequestMap from '../../transaction/solana/solana-transaction-request-map';

export type SolanaRawDappRequestDTO =
  | {
      id: number;
      type: RequestType.ConnectDapp;
      method: SolanaMethod.ConnectDapp;
      payload: undefined;
      chain: Chain.Solana;
    }
  | {
      id: number;
      type: RequestType.SignAndSendTransaction;
      method: SolanaMethod.SignAndSendTransaction;
      payload: SolanaTransactionRequestMap.SolanaTransactionRequestDappDTO;
      chain: Chain.Solana;
    }
  | {
      id: number;
      type: RequestType.SignTransaction;
      method: SolanaMethod.SignTransaction;
      payload: SolanaTransactionRequestMap.SolanaTransactionRequestDappDTO;
      chain: Chain.Solana;
    }
  | {
      id: number;
      type: RequestType.SignTransaction;
      method: SolanaMethod.SignAllTransactions;
      payload: SolanaTransactionRequestMap.SolanaTransactionRequestDappDTO;
      chain: Chain.Solana;
    };

export function mapDappDTOToDomain(dto: unknown): DappRequest {
  assert(isObjectLike<SolanaRawDappRequestDTO>(dto), 'the dapp request dapp dto must be an object');
  assert(typeof dto.id === 'number', 'id must be a number');
  assert(
    typeof dto.payload === 'undefined' || isObjectLike<SolanaRawDappRequestDTO['payload']>(dto.payload),
    'payload must be an object or undefined',
  );
  assertEnum(dto.type, RequestType);
  assert(typeof dto.method === 'string', 'method must be a string');
  assertEnum(dto.chain, Chain);

  let value: DappRequest;

  switch (dto.method) {
    case SolanaMethod.ConnectDapp:
      value = DappRequest.create({
        id: dto.id,
        type: RequestType.ConnectDapp,
        method: dto.method,
        payload: undefined,
        chain: Chain.Solana,
      });
      break;
    case SolanaMethod.SignAndSendTransaction:
      value = DappRequest.create({
        id: dto.id,
        type: RequestType.SignAndSendTransaction,
        method: SolanaMethod.SignAndSendTransaction,
        payload: SolanaTransactionRequestMap.mapDappDTOToDomain(dto.payload),
        chain: Chain.Solana,
      });
      break;
    case SolanaMethod.SignTransaction:
      value = DappRequest.create({
        id: dto.id,
        type: RequestType.SignTransaction,
        method: SolanaMethod.SignTransaction,
        payload: SolanaTransactionRequestMap.mapDappDTOToDomain(dto.payload),
        chain: Chain.Solana,
      });
      break;
    case SolanaMethod.SignAllTransactions:
      value = DappRequest.create({
        id: dto.id,
        type: RequestType.SignTransaction,
        method: SolanaMethod.SignAllTransactions,
        payload: SolanaTransactionRequestMap.mapDappDTOToDomain(dto.payload),
        chain: Chain.Solana,
      });
      break;
    default:
      assertUnreachable(dto.method);
  }

  return value;
}
