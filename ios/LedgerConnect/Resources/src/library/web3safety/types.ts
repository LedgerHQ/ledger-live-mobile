import { ValueObjectProps } from '../ddd-core-objects/value-object';
import { CachedTxInfo } from '../../content/external/stores/web3safety/indexdb/types';

export interface InternalTransactionInfo {
  type: string;
  from: string;
  to: string;
  input: string;
  gas: number;
  gasUsed: number;
  value: string;
  contractCall: ContractCall;
}

export interface PerformanceProfile {
  breakdown: {
    label: string;
    timeStamp: Date;
  }[];
}

export interface SimDetails {
  blockNumber: number;
  performanceProfile: PerformanceProfile;
  e2eMs: number;
}

export interface ContractCall {
  methodName: string;
  params: ValueObjectProps;
  contractAddress: string;
  contractType: string;
}

export interface TransactionBalanceChange {
  address: string;
  delta: string;
}

export interface TransactionEstimationInfo {
  status: string;
  simulatedBlockNumber: number;
  from: string;
  to: string;
  value: number;
  gas: number;
  gasPrice: number;
  input: string;
  type: number;
  gasUsed: number;
  internalTransactions: InternalTransactionInfo[];
  netBalanceChanges: TransactionBalanceChange[];
  error: string;
  simDetails: SimDetails;
  serverVersion: string;
  system: string;
  network: string;
  contractCall: ContractCall;
}

export interface EtherscanResponse {
  status: '1' | '0';
  message: string;
  result: CachedTxInfo[];
}

export interface SearchEvent extends Event {
  target: IDBRequest;
}

export interface TransactionEstimationOptions {
  contract: string;
  address: string;
  txData?: string;
  gas: string;
  gasPrice?: string;
  value?: string;
}
export interface NetworkInformation {
  networkFeeUSD: string;
  networkFeeETH: string;
  processingTime: string;
  predictedImpact: string;
}
