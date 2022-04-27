import { clusterApiUrl, Connection, sendAndConfirmRawTransaction, Transaction } from '@solana/web3.js';
import { Signature } from '../../../domain/transaction/solana/signature';
import * as SignatureMap from '../../maps/transaction/solana/signature-map';

export const sendTransaction = async (transaction: Transaction): Promise<Signature> => {
  const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

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
