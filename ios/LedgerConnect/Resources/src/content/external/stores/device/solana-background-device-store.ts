import assert from 'assert';
import { Transaction } from '@solana/web3.js';
import { ExtensionComponent, ExtensionMessageRequest, MethodRequest } from '../../../../messaging';
import { DappRequest, DappRequestProps } from '../../../use-case/dto/dapp-request';
import * as AccountsMap from '../../maps/ledger/accounts-map';
import * as TransactionMap from '../../maps/transaction/solana/transaction-map';
import * as SignatureMap from '../../maps/transaction/solana/signature-map';
import { Account } from '../../../domain/ledger/account';
import { Signature } from '../../../domain/transaction/solana/signature';

export const requestSolanaDefaultAccount = async (request: DappRequest<DappRequestProps>): Promise<Account> => {
  console.log('[solana-background-device-store] request default account request', request);

  const methodRequest: MethodRequest = {
    id: request.getID(),
    type: request.getType(),
    method: request.getMethod(),
    chain: request.getChain(),
    payload: {},
  };

  const message: ExtensionMessageRequest = {
    sender: ExtensionComponent.content,
    destination: ExtensionComponent.background,
    request: methodRequest,
  };

  const result = await browser.runtime.sendMessage(message);

  if (typeof result === 'object' && result.error) {
    throw new Error(`Error while signing transaction: ${result.error}`);
  }

  const accounts = AccountsMap.mapNativeDTOToDomain(result);
  assert(accounts.length > 0, 'Could not find any accounts while getting default account');
  const defaultAccount = accounts[0];
  console.log('[solana-background-device-store] request default account result', defaultAccount);

  return defaultAccount;
};

export const signTransaction = async (transaction: Transaction, request: DappRequest): Promise<Signature> => {
  console.log('[solana-background-device-store] sign transaction', transaction, request);

  const transactionDTO = TransactionMap.mapDomainToNativeDTO(transaction);

  const methodRequest: MethodRequest = {
    id: request.getID(),
    type: request.getType(),
    method: request.getMethod(),
    chain: request.getChain(),
    payload: transactionDTO,
  };

  const message: ExtensionMessageRequest = {
    sender: ExtensionComponent.content,
    destination: ExtensionComponent.background,
    request: methodRequest,
  };

  const result = await browser.runtime.sendMessage(message);

  if (typeof result === 'object' && result.error) {
    throw new Error(`Error while signing transaction: ${result.error}`);
  }

  console.log('[solana-background-device-store] sign transaction result', result);
  return SignatureMap.mapNativeDTOToDomain(result);
};
