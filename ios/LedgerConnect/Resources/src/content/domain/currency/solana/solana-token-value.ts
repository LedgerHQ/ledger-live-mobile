import assert from 'assert';
import { ValueObject } from '../../../../library/ddd-core-objects';
import { TokenValue } from '../token-value';

interface SolanaTokenValueProps {
  valueDecimal: number;
  decimals: number;
  symbol: string;
}

export class SolanaTokenValue extends ValueObject<SolanaTokenValueProps> implements TokenValue {
  public getValueDecimal(): number {
    const { decimals } = this.props;
    return this.props.valueDecimal / 10 ** decimals;
  }

  public getValueDecimalFormatted(substringLength = 7, withSymbol = true): string {
    const valueDecimal = this.getValueDecimal().toString();
    return `${valueDecimal.substring(0, substringLength)}${withSymbol ? ` ${this.props.symbol}` : ''}`;
  }

  public static create(props: SolanaTokenValueProps): SolanaTokenValue {
    assert(props.decimals >= 0, 'decimals must be greater than or equal to zero');
    return new SolanaTokenValue(props);
  }
}
