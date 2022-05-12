import { TokenValue } from '../../../domain/currency/token-value';
import { Account } from '../../../domain/ledger/account';
import { SignedTransaction } from '../../../domain/transaction/ethereum/signed-transaction';
import { TransactionHash } from '../../../domain/transaction/ethereum/transaction-hash';
import * as TransactionHashMap from '../../maps/transaction/ethereum/transaction-hash-map';
import * as TokenValueMap from '../../maps/currency/ethereum/ethereum-token-value-map';

const jsonrpcVersion = '2.0';

enum AlchemyAPI {
  GetBalance = 'eth_getBalance',
  SendRawTransaction = 'eth_sendRawTransaction',
}

export interface Payload {
  id: number;
  method: string;
  params: (string | boolean)[];
  jsonrpc: typeof jsonrpcVersion;
}

// const rpcURL = 'https://eth-ropsten.alchemyapi.io/v2/G5ywN3ywt4S0L-2Ai92Ub1efL3aLQWWb';
const rpcURL = 'https://eth-mainnet.alchemyapi.io/v2/-kuNbDetSLplTph8eLySef5J8Rww1DEp';

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

export async function getNativeTokenValue(account: Account): Promise<TokenValue> {
  const accountValue = account.getValue();
  const payload: Payload = {
    id: 0,
    method: AlchemyAPI.GetBalance,
    params: [accountValue, 'latest'],
    jsonrpc: jsonrpcVersion,
  };
  const result = await call(payload);
  return TokenValueMap.mapAlchemyDTOToDomain(result);
}

export const sendTransaction = async (signedTransaction: SignedTransaction): Promise<TransactionHash> => {
  const payload: Payload = {
    id: 0,
    method: AlchemyAPI.SendRawTransaction,
    params: [signedTransaction.getSignedTransactionData()],
    jsonrpc: jsonrpcVersion,
  };
  const result = await call(payload);

  // await new Promise((resolve) => {
  //   setTimeout(resolve, 10000);
  // });

  // const result = {
  //   id: 0,
  //   jsonrpc: '2.0',
  //   result: '0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331',
  // };

  return TransactionHashMap.mapAlchemyDTOToDomain(result);
};
