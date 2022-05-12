import { Chain } from '../../../domain/chain';

import * as ethereumWeb3SafetyStore from './ethereum-web3safety-store';
import * as solanaWeb3SafetyStore from './solana-web3safety-store';

type EthereumStoreType = typeof ethereumWeb3SafetyStore;
type SolanaStoreType = typeof solanaWeb3SafetyStore;
type Web3CheckStore = EthereumStoreType | SolanaStoreType;

export const getWeb3SafetyStore = (chain: Chain): Web3CheckStore => {
  if (chain === Chain.Solana) {
    return solanaWeb3SafetyStore;
  }

  return ethereumWeb3SafetyStore;
};
