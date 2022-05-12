import { ValueObject } from '../../../../library/ddd-core-objects';

interface SignedTransactionProps {
  signedTransactionData: string;
}

export class SignedTransaction extends ValueObject<SignedTransactionProps> {
  public getSignedTransactionData(): string {
    return this.props.signedTransactionData;
  }

  public static create(signedTransactionData: string): SignedTransaction {
    return new SignedTransaction({ signedTransactionData });
  }
}
