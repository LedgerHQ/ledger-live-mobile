import { EthereumTokenValue } from './ethereum-token-value';

describe('Token Value', () => {
  it('returns the value in hex', () => {
    const tokenValue = EthereumTokenValue.create({
      valueHex: '0x78b45cf9aaf40',
      decimals: 18,
      symbol: 'ETH',
    });
    expect(tokenValue.getValueHex()).toEqual('0x78b45cf9aaf40');
  });

  it('returns the decimal value', () => {
    const tokenValue = EthereumTokenValue.create({
      valueHex: '0x78b45cf9aaf40',
      decimals: 18,
      symbol: 'ETH',
    });
    expect(tokenValue.getValueDecimal()).toEqual(0.002123456789);
  });

  it('formats the value', () => {
    const tokenValue = EthereumTokenValue.create({
      valueHex: '0x78b45cf9aaf40',
      decimals: 18,
      symbol: 'ETH',
    });
    expect(tokenValue.getValueDecimalFormatted(9, true)).toEqual('0.0021234 ETH');
  });

  it('throws an error when created with a non-hex number', () => {
    expect(() =>
      EthereumTokenValue.create({
        valueHex: '78b45cf9aaf40',
        decimals: 18,
        symbol: 'ETH',
      }),
    ).toThrow();
  });
});
