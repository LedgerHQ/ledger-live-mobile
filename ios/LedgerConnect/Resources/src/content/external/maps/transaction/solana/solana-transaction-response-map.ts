import { Transaction } from '@solana/web3.js';
import { DappResponse } from '../../../../use-case/dto/dapp-response';
import { Signature } from '../../../../domain/transaction/solana/signature';
import { DappRequest, RequestType, SolanaMethod } from '../../../../use-case/dto/dapp-request';
import { Chain } from '../../../../domain/chain';

export function mapSignAndSendTransactionResponseToDomain(
  sentSignature: Signature,
  request: DappRequest,
): DappResponse {
  return DappResponse.create({
    id: request.getID(),
    type: RequestType.SignAndSendTransaction,
    method: SolanaMethod.SignAndSendTransaction,
    payload: sentSignature,
    chain: Chain.Solana,
  });
}

export function mapSignTransactionResponseToDomain(transaction: Transaction, request: DappRequest): DappResponse {
  return DappResponse.create({
    id: request.getID(),
    type: RequestType.SignTransaction,
    method: SolanaMethod.SignTransaction,
    payload: transaction,
    chain: Chain.Solana,
  });
}

export function mapSignAllTransactionsResponseToDomain(
  transactions: Transaction[],
  request: DappRequest,
): DappResponse {
  return DappResponse.create({
    id: request.getID(),
    type: RequestType.SignTransaction,
    method: SolanaMethod.SignAllTransactions,
    payload: transactions,
    chain: Chain.Solana,
  });
}
