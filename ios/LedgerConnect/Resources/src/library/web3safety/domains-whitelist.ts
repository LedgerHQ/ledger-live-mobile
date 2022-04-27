export interface WhitelistedDomain {
  address: string;
  name: string;
}

export const whitelist: WhitelistedDomain[] = [
  {
    address: '0x5abfec25f74cd88437631a7731906932776356f9',
    name: 'test defi',
  },
];
