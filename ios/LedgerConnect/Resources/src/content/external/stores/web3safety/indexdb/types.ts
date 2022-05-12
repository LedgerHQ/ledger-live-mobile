export interface CachedTxInfo {
  hash: string;
  from: string;
  to: string;
  timeStamp: number;
  blockNumber: number;
}

export interface FindQuery {
  index: string;
  values: string | string[];
}
