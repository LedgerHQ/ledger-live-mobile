/**
 * Get the decimal value formatted with a substring length and optionally the symbol.
 * Example: getValueDecimalFormatted(9, true) => 0.0021234 ETH
 */
export interface TokenValue {
  getValueDecimalFormatted(substringLength?: number, withSymbol?: boolean): string;
}
