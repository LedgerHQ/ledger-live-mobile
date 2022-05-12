export type GenericAsyncFunction = (...args: any[]) => Promise<any>;
export type GenericFunction = (...args: any[]) => any;

export interface ApiCallOptions {
  args?: any[];
  onSuccess?: (response: any, args: any[]) => void;
  onFail?: (error: unknown, args: any[]) => void;
}
