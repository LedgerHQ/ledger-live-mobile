import assert from 'assert';
import { isHexPrefixed } from 'ethereumjs-util';
import { ValueObject } from '../../../../library/ddd-core-objects';
import { TokenValue } from '../token-value';

interface EthereumTokenValueProps {
  valueHex: string;
  decimals: number;
  symbol: string;
}

export class EthereumTokenValue extends ValueObject<EthereumTokenValueProps> implements TokenValue {
  public getValueDecimal(): number {
    const { decimals } = this.props;
    return parseInt(this.props.valueHex, 16) / 10 ** decimals;
  }

  public getValueDecimalFormatted(substringLength = 7, withSymbol = true): string {
    const valueDecimal = this.getValueDecimal().toString();
    return `${valueDecimal.substring(0, substringLength)}${withSymbol ? ` ${this.props.symbol}` : ''}`;
  }

  public getValueHex(): string {
    return this.props.valueHex;
  }

  public static create(props: EthereumTokenValueProps): EthereumTokenValue {
    assert(isHexPrefixed(props.valueHex), 'number must be hex and start with 0x');
    assert(props.decimals >= 0, 'decimals must be greater than or equal to zero');
    return new EthereumTokenValue(props);
  }
}
