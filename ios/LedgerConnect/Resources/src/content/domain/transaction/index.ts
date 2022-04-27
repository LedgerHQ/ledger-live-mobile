import { ValueObject } from '../../../library/ddd-core-objects';
import { TokenValue } from '../currency/token-value';

interface TransactionProps {
  from: string;
  to: string;
  value: TokenValue;
}

export class Transaction extends ValueObject<TransactionProps> {
  public getFrom(): string {
    return this.props.from;
  }

  public getTo(): string {
    return this.props.to;
  }

  public getValue(): TokenValue {
    return this.props.value;
  }

  public static create(props: TransactionProps): Transaction {
    return new Transaction(props);
  }
}
