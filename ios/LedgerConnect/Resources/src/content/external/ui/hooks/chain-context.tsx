import React from 'react';
import { Chain } from '../../../domain/chain';
import { DappInformationStore } from '../../../domain/dapp-information/dapp-information-store';
import { DOMDappInformationStore } from '../../stores/dapp/dom-dapp-information-store';
import { EthereumIcon } from '../images/ethereum-icon';
import { SolanaIcon } from '../images/solana-icon';

interface ChainContext {
  chain: Chain;
  chainTokenSymbol: string;
  chainTokenIcon: JSX.Element;
  chainName: string;
  dappInformationStore: DappInformationStore;
}

interface ChainProviderProps {
  children: React.ReactNode;
  chain: Chain;
}

const chainContexts: { [key in Chain]: ChainContext } = {
  ethereum: {
    chain: Chain.Ethereum,
    chainTokenSymbol: 'ETH',
    chainTokenIcon: EthereumIcon,
    chainName: 'Ethereum',
    dappInformationStore: new DOMDappInformationStore(),
  },
  solana: {
    chain: Chain.Solana,
    chainTokenSymbol: 'SOL',
    chainTokenIcon: SolanaIcon,
    chainName: 'Solana',
    dappInformationStore: new DOMDappInformationStore(),
  },
};

const ChainContext = React.createContext<ChainContext | undefined>(undefined);

export function ChainProvider({ chain, children }: ChainProviderProps): JSX.Element {
  const value = chainContexts[chain];
  return <ChainContext.Provider value={value}>{children}</ChainContext.Provider>;
}

export function useChain(): ChainContext {
  const context = React.useContext(ChainContext);
  if (context === undefined) {
    throw new Error('useChain must be used within a ChainProvider');
  }
  return context;
}
