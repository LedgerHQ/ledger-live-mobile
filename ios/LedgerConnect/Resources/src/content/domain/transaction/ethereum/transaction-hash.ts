import { ValueObject } from '../../../../library/ddd-core-objects';

interface TransactionHashProps {
  transactionHash: string;
}

const zeroHash = '0x0';

export class TransactionHash extends ValueObject<TransactionHashProps> {
  public getTransactionHashData(): string {
    return this.props.transactionHash;
  }

  public isZero(): boolean {
    return this.props.transactionHash === zeroHash;
  }

  public static create(transactionHash: string): TransactionHash {
    return new TransactionHash({ transactionHash });
  }
}
