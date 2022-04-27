import { DappRequest } from '../../use-case/dto/dapp-request';
import { DappResponse } from '../../use-case/dto/dapp-response';
import { Account } from '../ledger/account';

export type OnResponseFunction = (response: DappResponse) => void;

export type StoreAccountFunction = (onResponse: OnResponseFunction) => void;

export interface RequestDefaultAccountResponse {
  account: Account;
  storeAccountAndRespond: StoreAccountFunction;
}

export interface DappConnectionStore {
  requestDefaultAccount(request: DappRequest): Promise<RequestDefaultAccountResponse>;
}
