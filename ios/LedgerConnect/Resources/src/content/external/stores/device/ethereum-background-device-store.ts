import assert from 'assert';
import { ExtensionComponent, ExtensionMessageRequest, MethodRequest } from '../../../../messaging';
import { DappRequest } from '../../../use-case/dto/dapp-request';
import * as AccountsMap from '../../maps/ledger/accounts-map';
import { SignedTransaction } from '../../../domain/transaction/ethereum/signed-transaction';
import * as EthereumTransactionRequestMap from '../../maps/transaction/ethereum/ethereum-transaction-request-map';
import * as SignedTransactionMap from '../../maps/transaction/ethereum/signed-transaction-map';
import { Account } from '../../../domain/ledger/account';
import { EthereumTransactionRequest } from '../../../domain/transaction/ethereum/ethereum-transaction-request';

export const requestEthereumDefaultAccount = async (request: DappRequest): Promise<Account> => {
  console.log('[ethereum-background-device-store] request default account request', request);

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
    throw new Error(`Error while getting accounts: ${result.error}`);
  }

  const accounts = AccountsMap.mapNativeDTOToDomain(result);
  assert(accounts.length > 0, 'Could not find any accounts while getting default account');
  const defaultAccount = accounts[0];
  console.log('[ethereum-background-device-store] request default account result', defaultAccount);

  return defaultAccount;
};

export const signTransaction = async (request: DappRequest): Promise<SignedTransaction> => {
  console.log('[ethereum-background-device-store] sign transaction', request);

  const transaction = request.getPayload();
  assert(transaction instanceof EthereumTransactionRequest, 'transaction must be an EthereumTransactionRequest');
  const transactionDTO = EthereumTransactionRequestMap.mapDomainToNativeDTO(transaction);

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

  console.log('[ethereum-background-device-store] sign transaction result', result);
  return SignedTransactionMap.mapNativeDTOToDomain(result);
};
