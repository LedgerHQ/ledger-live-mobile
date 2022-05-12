import { Chain } from '../../content/domain/chain';

export interface WhitelistedContract {
  address: string;
  name: string;
}

export interface WhitelistDomain {
  name: string;
  domain: string;
  chain: Chain;
  token: string;
}

export const contractsWhitelist: WhitelistedContract[] = [
  {
    address: '0x5abfec25f74cd88437631a7731906932776356f9',
    name: 'test defi',
  },
];

export const domainsWhitelist: WhitelistDomain[] = [
  {
    name: 'Opensea',
    domain: 'opensea.io',
    chain: Chain.Ethereum,
    token: 'null',
  },
  {
    name: 'LooksRare',
    domain: 'looksrare.org',
    chain: Chain.Ethereum,
    token: 'null',
  },
  {
    name: '1inch',
    domain: 'app.1inch.io',
    chain: Chain.Ethereum,
    token: '1INCH',
  },
  {
    name: 'Rarible',
    domain: 'rarible.com',
    chain: Chain.Ethereum,
    token: 'RARI',
  },
  {
    name: 'Curve',
    domain: 'curve.fi',
    chain: Chain.Ethereum,
    token: 'CRV',
  },
  {
    name: 'Oasis',
    domain: 'oasis.app',
    chain: Chain.Ethereum,
    token: 'MKR',
  },
  {
    name: 'Uniswap',
    domain: 'app.uniswap.org',
    chain: Chain.Ethereum,
    token: 'UNI',
  },
  {
    name: 'Paraswap',
    domain: 'app.paraswap.io',
    chain: Chain.Ethereum,
    token: 'PSP',
  },
  {
    name: 'Convex',
    domain: 'convexfinance.com',
    chain: Chain.Ethereum,
    token: 'CVX',
  },
  {
    name: 'Lido',
    domain: 'stake.lido.fi',
    chain: Chain.Ethereum,
    token: 'LDO',
  },
  {
    name: 'Aave',
    domain: 'app.aave.com',
    chain: Chain.Ethereum,
    token: 'AAVE',
  },
  {
    name: 'Compound',
    domain: 'app.compound.finance',
    chain: Chain.Ethereum,
    token: 'COMP',
  },
  {
    name: 'Balancer',
    domain: 'app.balancer.fi',
    chain: Chain.Ethereum,
    token: 'BAL',
  },
  {
    name: 'Yearn',
    domain: 'yearn.finance',
    chain: Chain.Ethereum,
    token: 'YFI',
  },
  {
    name: 'Sushi',
    domain: 'app.sushi.com',
    chain: Chain.Ethereum,
    token: 'SUSHI',
  },
  {
    name: 'MagicEden',
    domain: 'magiceden.io',
    chain: Chain.Solana,
    token: 'null',
  },
];
