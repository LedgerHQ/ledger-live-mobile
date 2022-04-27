import { SerializeConfig, Transaction } from '@solana/web3.js';

type TransactionNativeDTO = string[];

export type TransactionDappDTO = string;

export function mapDappDTOToDomain(serializedTransactionHex: string): Transaction {
  const buffer = Buffer.from(serializedTransactionHex, 'hex');
  return Transaction.from(buffer);
}

export function mapDomainToNativeDTO(transaction: Transaction): TransactionNativeDTO {
  return [transaction.serializeMessage().toString('hex')];
}

export function mapDomainToDappDTO(transaction: Transaction): TransactionDappDTO {
  const config: SerializeConfig = { requireAllSignatures: true, verifySignatures: true };
  const buffer = transaction.serialize(config);
  return buffer.toString('hex');
}
