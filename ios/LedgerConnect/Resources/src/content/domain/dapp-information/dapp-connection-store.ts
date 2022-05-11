import React from 'react';
import { AccountAction } from '../../external/ui/hooks/account-context';
import { DappRequest } from '../../use-case/dto/dapp-request';
import { DappResponse } from '../../use-case/dto/dapp-response';
import { TokenValue } from '../currency/token-value';
import { Account } from '../ledger/account';

export type ApproveAccountFunction = () => void;

export interface ProcessAccountConnectionProps {
  request: DappRequest;
  dispatch: React.Dispatch<AccountAction>;
  onResponse: (response: DappResponse) => void;
}

export interface ProcessAccountConnectionResult {
  handleApproveAccount: ApproveAccountFunction;
  accountToApprove: Account;
  getAccountValue: () => Promise<TokenValue>;
}

export interface DappConnectionStore {
  processAccountConnection(props: ProcessAccountConnectionProps): Promise<ProcessAccountConnectionResult>;
}
