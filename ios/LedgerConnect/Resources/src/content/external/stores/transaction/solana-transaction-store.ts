import { PublicKey, Transaction } from '@solana/web3.js';
import assert from 'assert';
import { Transaction as UITransaction } from '../../../domain/transaction';
import { DappRequest, SolanaMethod } from '../../../use-case/dto/dapp-request';
import { ProcessTransactionProps } from '../../../domain/transaction/transaction-store';
import { signTransaction } from '../device/solana-background-device-store';
import { sendTransaction } from '../chain/solana-web3-chain-store';
import { SolanaTransactionRequest } from '../../../domain/transaction/solana/solana-transaction-request';
import { TokenValue } from '../../../domain/currency/token-value';
import * as SolanaTransactionResponseMap from '../../maps/transaction/solana/solana-transaction-response-map';

export function mapTransaction(request: DappRequest): UITransaction {
  const payload = request.getPayload() as SolanaTransactionRequest;
  assert(payload instanceof SolanaTransactionRequest, 'request chain must be Solana to map transaction');

  return UITransaction.create({
    from: '0x0',
    to: '0x0',
    value: TokenValue.create({
      valueHex: '0x78b45cf9',
      decimals: 9,
      symbol: 'SOL',
    }),
  });
}

function getTransactionsFromPayload(request: DappRequest): Transaction[] {
  const payload = request.getPayload();
  assert(payload instanceof SolanaTransactionRequest, 'payload must be SolanaTransactionRequest');
  return payload.getTransactions();
}

function getPublicKeyFromPayload(request: DappRequest): PublicKey {
  const payload = request.getPayload();
  assert(payload instanceof SolanaTransactionRequest, 'payload must be SolanaTransactionRequest');
  return payload.getPublicKey();
}

async function signAndPackTransactions({
  request,
  onTransactionSigned,
}: ProcessTransactionProps): Promise<Transaction[]> {
  const transactions = getTransactionsFromPayload(request);

  for (let i = 0; i < transactions.length; i += 1) {
    const transaction = transactions[i];
    // eslint-disable-next-line no-await-in-loop
    const signedSignature = await signTransaction(transaction, request);

    const publicKey = getPublicKeyFromPayload(request);
    const buffer = signedSignature.getSignatureBuffer();

    transaction.addSignature(publicKey, buffer);

    const signaturesValid = transaction.verifySignatures();
    assert(signaturesValid, 'signatures are invalid while signing a transaction');
  }

  onTransactionSigned();

  return transactions;
}

async function signAndSend(props: ProcessTransactionProps): Promise<void> {
  const { request, onResponse } = props;

  const transactions = getTransactionsFromPayload(request);
  assert(
    transactions.length === 1,
    `There should be exactly one transaction for ${SolanaMethod.SignAndSendTransaction} but got ${transactions.length}`,
  );

  const signedTransactions = await signAndPackTransactions(props);
  const signedTransaction = signedTransactions[0];

  const sentSignature = await sendTransaction(signedTransaction);
  const response = SolanaTransactionResponseMap.mapSignAndSendTransactionResponseToDomain(sentSignature, request);
  onResponse(response);
}

async function sign(props: ProcessTransactionProps): Promise<void> {
  const { request, onResponse } = props;

  const transactions = getTransactionsFromPayload(request);
  assert(
    transactions.length === 1,
    `There should be exactly one transaction for ${SolanaMethod.SignTransaction} but got ${transactions.length}`,
  );

  const signedTransactions = await signAndPackTransactions(props);
  const signedTransaction = signedTransactions[0];

  const response = SolanaTransactionResponseMap.mapSignTransactionResponseToDomain(signedTransaction, request);
  onResponse(response);
}

async function signAll(props: ProcessTransactionProps): Promise<void> {
  const { request, onResponse } = props;

  const signedTransactions = await signAndPackTransactions(props);

  const response = SolanaTransactionResponseMap.mapSignAllTransactionsResponseToDomain(signedTransactions, request);
  onResponse(response);
}

export async function processTransaction(props: ProcessTransactionProps): Promise<void> {
  const { request } = props;
  const method = request.getMethod();

  switch (method) {
    case SolanaMethod.SignAndSendTransaction:
      return signAndSend(props);
    case SolanaMethod.SignTransaction:
      return sign(props);
    case SolanaMethod.SignAllTransactions:
      return signAll(props);
    default:
      throw new Error(`Unrecognized method "${method}" while processing solana transaction`);
  }
}
