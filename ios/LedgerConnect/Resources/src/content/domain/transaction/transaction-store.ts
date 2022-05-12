import { Transaction } from '.';
import { DappRequest } from '../../use-case/dto/dapp-request';
import { DappResponse } from '../../use-case/dto/dapp-response';

export interface ProcessTransactionProps {
  request: DappRequest;
  onTransactionSigned: () => void;
  onResponse: (response: DappResponse) => void;
}

export interface TransactionStore {
  mapTransaction(request: DappRequest): Transaction;
  processTransaction(props: ProcessTransactionProps): Promise<void>;
}
