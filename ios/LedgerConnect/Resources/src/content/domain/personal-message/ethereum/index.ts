import { toAscii } from 'ethereumjs-util';
import { ValueObject } from '../../../../library/ddd-core-objects';

interface EthereumPersonalMessageProps {
  messageDataHex: string;
}

export class EthereumPersonalMessage extends ValueObject<EthereumPersonalMessageProps> {
  public getValueHex(): string {
    return this.props.messageDataHex;
  }

  public getValueAscii(): string {
    return toAscii(this.props.messageDataHex);
  }

  public static create(messageDataHex: string): EthereumPersonalMessage {
    return new EthereumPersonalMessage({ messageDataHex });
  }
}
