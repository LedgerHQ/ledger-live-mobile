import { clusterApiUrl, Connection, PublicKey, sendAndConfirmRawTransaction, Transaction } from '@solana/web3.js';
import { SolanaTokenValue } from '../../../domain/currency/solana/solana-token-value';
import { TokenValue } from '../../../domain/currency/token-value';
import { Account } from '../../../domain/ledger/account';
import { Signature } from '../../../domain/transaction/solana/signature';
import * as SignatureMap from '../../maps/transaction/solana/signature-map';

const cluster = 'mainnet-beta';

export async function getNativeTokenValue(account: Account): Promise<TokenValue> {
  const connection = new Connection(clusterApiUrl(cluster), 'confirmed');
  const publicKey = new PublicKey(account.getValue());
  const valueDecimal = await connection.getBalance(publicKey, 'confirmed');
  return SolanaTokenValue.create({ valueDecimal, decimals: 9, symbol: 'SOL' });
}

export const sendTransaction = async (transaction: Transaction): Promise<Signature> => {
  const connection = new Connection(clusterApiUrl(cluster), 'confirmed');

  const serializedTransaction = transaction.serialize();

  const rawSignature = await sendAndConfirmRawTransaction(connection, serializedTransaction);

  // await new Promise((resolve) => {
  //   setTimeout(resolve, 10000);
  // });

  // const result = {
  //   id,
  //   jsonrpc: '2.0',
  //   result: '0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331',
  // };

  return SignatureMap.mapWeb3DTOToDomain(rawSignature);
};
