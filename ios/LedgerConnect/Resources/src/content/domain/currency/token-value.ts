import assert from 'assert';
import { isHexPrefixed } from 'ethereumjs-util';
import { ValueObject } from '../../../library/ddd-core-objects';

interface TokenValueProps {
  valueHex: string;
  decimals: number;
  symbol: string;
}

export class TokenValue extends ValueObject<TokenValueProps> {
  public getValueDecimal(): number {
    const { decimals } = this.props;
    return parseInt(this.props.valueHex, 16) / 10 ** decimals;
  }

  /**
   * Get the decimal value formatted with a substring length and optionally the symbol.
   * Example: getValueDecimalFormatted(9, true) => 0.0021234 ETH
   */
  public getValueDecimalFormatted(substringLength: number, withSymbol = true): string {
    const valueDecimal = this.getValueDecimal().toString();
    return `${valueDecimal.substring(0, 9)}${withSymbol ? ` ${this.props.symbol}` : ''}`;
  }

  public getValueHex(): string {
    return this.props.valueHex;
  }

  public static create(props: TokenValueProps): TokenValue {
    assert(isHexPrefixed(props.valueHex), 'number must be hex and start with 0x');
    assert(props.decimals >= 0, 'decimals must be greater than or equal to zero');
    return new TokenValue(props);
  }
}
