import { SignedTransaction } from '../../../domain/transaction/ethereum/signed-transaction';
import { TransactionHash } from '../../../domain/transaction/ethereum/transaction-hash';
import * as TransactionHashMap from '../../maps/transaction/ethereum/transaction-hash-map';

const jsonrpcVersion = '2.0';

enum AlchemyAPI {
  SendRawTransaction = 'eth_sendRawTransaction',
}

export interface Payload {
  id: number;
  method: string;
  params: (string | boolean)[];
  jsonrpc: typeof jsonrpcVersion;
}

const rpcURL = 'https://eth-ropsten.alchemyapi.io/v2/G5ywN3ywt4S0L-2Ai92Ub1efL3aLQWWb';

const call = async <T>(payload: Payload): Promise<T> => {
  const response = await fetch(rpcURL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const responseJSON = await response.json();
  if (!responseJSON.result && responseJSON.error) {
    console.log('<== rpc error', responseJSON.error);
    throw new Error(responseJSON.error.message || 'rpc error');
  }
  return responseJSON;
};

export const sendTransaction = async (
  signedTransaction: SignedTransaction,
  requestID: number,
): Promise<TransactionHash> => {
  const payload: Payload = {
    id: requestID,
    method: AlchemyAPI.SendRawTransaction,
    params: [signedTransaction.getSignedTransactionData()],
    jsonrpc: jsonrpcVersion,
  };
  const result = await call<TransactionHashMap.TransactionHashAlchemyDTO>(payload);

  // await new Promise((resolve) => {
  //   setTimeout(resolve, 10000);
  // });

  // const result = {
  //   id: requestID,
  //   jsonrpc: '2.0',
  //   result: '0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331',
  // };

  return TransactionHashMap.mapAlchemyDTOToDomain(result);
};
