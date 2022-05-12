import { PublicKey, Transaction } from '@solana/web3.js';
import { ValueObject } from '../../../../library/ddd-core-objects';

interface SolanaTransactionRequestProps {
  transactions: Transaction[];
  publicKey: PublicKey;
}

export class SolanaTransactionRequest extends ValueObject<SolanaTransactionRequestProps> {
  public getTransactions(): Transaction[] {
    return this.props.transactions;
  }

  public getPublicKey(): PublicKey {
    return this.props.publicKey;
  }

  public static create(props: SolanaTransactionRequestProps): SolanaTransactionRequest {
    return new SolanaTransactionRequest(props);
  }
}
