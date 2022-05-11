import {
  NetworkInformation,
  TransactionEstimationInfo,
  TransactionEstimationOptions,
} from '../../../../library/web3safety/types';
import { Chain } from '../../../domain/chain';

// NOTE: Stub SOL store to implement later

export const getLatestBlockNo = async (): Promise<number | null> => {
  return null;
};

export const isFirstTransaction = async (_address: string, _recipient: string): Promise<boolean> => {
  return false;
};

export const updateTransactions = async (_address: string): Promise<void> => {
  // do nothing
};

export const isDomainWhitelisted = (_domain: string, _chain: Chain): boolean => {
  return true;
};

export const isContractOlderThan = async (_address: string, _ageMs: number): Promise<boolean> => {
  return true;
};

export const estimateTransaction = async (
  _opts: TransactionEstimationOptions,
): Promise<TransactionEstimationInfo | null> => {
  return null;
};

export const getExchangeRates = async (_crypto: string, _fiat = 'usd'): Promise<number> => {
  return 0.0;
};

export const convertEstimationToNetworkInfo = async (_info: TransactionEstimationInfo): Promise<NetworkInformation> => {
  return {} as NetworkInformation;
};

export const simulate = async (_opts: TransactionEstimationOptions): Promise<NetworkInformation | null> => null;
