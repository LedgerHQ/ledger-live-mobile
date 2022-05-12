import { Transaction } from '@solana/web3.js';
import assert from 'assert';
import { DappResponse } from '../../../../use-case/dto/dapp-response';
import { RequestType, SolanaMethod } from '../../../../use-case/dto/dapp-request';
import { assertArrayOfInstance, assertUnreachable } from '../../../../../library/typeguards';
import * as SignatureMap from '../../transaction/solana/signature-map';
import * as TransactionMap from '../../transaction/solana/transaction-map';
import { Chain } from '../../../../domain/chain';
import { Account } from '../../../../domain/ledger/account';
import { Signature } from '../../../../domain/transaction/solana/signature';

export type SolanaRawDappResponseDTO =
  | {
      id: number;
      type: RequestType.ConnectDapp;
      method: SolanaMethod.ConnectDapp;
      payload: string;
      chain: Chain.Solana;
    }
  | {
      id: number;
      type: RequestType.SignAndSendTransaction;
      method: SolanaMethod.SignAndSendTransaction;
      payload: SignatureMap.SignatureDappDTO;
      chain: Chain.Solana;
    }
  | {
      id: number;
      type: RequestType.SignTransaction;
      method: SolanaMethod.SignTransaction;
      payload: TransactionMap.TransactionDappDTO;
      chain: Chain.Solana;
    }
  | {
      id: number;
      type: RequestType.SignTransaction;
      method: SolanaMethod.SignAllTransactions;
      payload: TransactionMap.TransactionDappDTO[];
      chain: Chain.Solana;
    };

export function mapDomainToDappDTO(response: DappResponse): SolanaRawDappResponseDTO {
  const method = response.getMethod();

  let value: SolanaRawDappResponseDTO;

  switch (method) {
    case SolanaMethod.ConnectDapp: {
      const account = response.getPayload();
      assert(account instanceof Account, 'response payload must be an instance of Account');
      value = {
        id: response.getID(),
        type: RequestType.ConnectDapp,
        method: SolanaMethod.ConnectDapp,
        payload: account ? account.getValue() : '',
        chain: Chain.Solana,
      };
      break;
    }
    case SolanaMethod.SignAndSendTransaction: {
      const signature = response.getPayload();
      assert(signature instanceof Signature, 'response payload must be an instance of Signature');
      value = {
        id: response.getID(),
        type: RequestType.SignAndSendTransaction,
        method: SolanaMethod.SignAndSendTransaction,
        payload: SignatureMap.mapDomainToDappDTO(signature),
        chain: Chain.Solana,
      };
      break;
    }
    case SolanaMethod.SignTransaction: {
      const transaction = response.getPayload();
      assert(transaction instanceof Transaction, 'response payload must be an instance of Signature');
      value = {
        id: response.getID(),
        type: RequestType.SignTransaction,
        method: SolanaMethod.SignTransaction,
        payload: TransactionMap.mapDomainToDappDTO(transaction),
        chain: Chain.Solana,
      };
      break;
    }
    case SolanaMethod.SignAllTransactions: {
      const transactions = response.getPayload();
      assertArrayOfInstance(transactions, Transaction);
      value = {
        id: response.getID(),
        type: RequestType.SignTransaction,
        method: SolanaMethod.SignAllTransactions,
        payload: transactions.map((transaction) => TransactionMap.mapDomainToDappDTO(transaction)),
        chain: Chain.Solana,
      };
      break;
    }
    default:
      assertUnreachable(method);
  }

  return value;
}
