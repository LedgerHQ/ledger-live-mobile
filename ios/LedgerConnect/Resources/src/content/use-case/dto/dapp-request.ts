import { ValueObject } from '../../../library/ddd-core-objects';
import { Chain } from '../../domain/chain';
import { EthereumPersonalMessage } from '../../domain/personal-message/ethereum';
import { EthereumTransactionRequest } from '../../domain/transaction/ethereum/ethereum-transaction-request';
import { SolanaTransactionRequest } from '../../domain/transaction/solana/solana-transaction-request';

export enum RequestType {
  ConnectDapp = 'connectDapp',
  SignAndSendTransaction = 'signAndSendTransaction',
  SignTransaction = 'signTransaction',
  SignPersonalMessage = 'signPersonalMessage',
}

/* Ethereum */

export enum EthereumMethod {
  ConnectDapp = 'eth_requestAccounts',
  SignAndSendTransaction = 'eth_sendTransaction',
  SignPersonalMessage = 'signPersonalMessage',
}

export type EthereumConnectDappDappRequestProps = {
  id: number;
  type: RequestType.ConnectDapp;
  method: EthereumMethod.ConnectDapp;
  payload: undefined;
  chain: Chain.Ethereum;
};

export type EthereumSignAndSendTransactionDappRequestProps = {
  id: number;
  type: RequestType.SignAndSendTransaction;
  method: EthereumMethod.SignAndSendTransaction;
  payload: EthereumTransactionRequest;
  chain: Chain.Ethereum;
};

export type EthereumSignPersonalMessageDappRequestProps = {
  id: number;
  type: RequestType.SignPersonalMessage;
  method: EthereumMethod.SignPersonalMessage;
  payload: EthereumPersonalMessage;
  chain: Chain.Ethereum;
};

/* Solana */

export enum SolanaMethod {
  ConnectDapp = 'solana_getAccount',
  SignAndSendTransaction = 'solana_signAndSendTransaction',
  SignTransaction = 'solana_signTransaction',
  SignAllTransactions = 'solana_signAllTransactions',
}

export type SolanaConnectDappDappRequestProps = {
  id: number;
  type: RequestType.ConnectDapp;
  method: SolanaMethod.ConnectDapp;
  payload: undefined;
  chain: Chain.Solana;
};

export type SolanaSignAndSendTransactionDappRequestProps = {
  id: number;
  type: RequestType.SignAndSendTransaction;
  method: SolanaMethod.SignAndSendTransaction;
  payload: SolanaTransactionRequest;
  chain: Chain.Solana;
};

export type SolanaSignTransactionDappRequestProps = {
  id: number;
  type: RequestType.SignTransaction;
  method: SolanaMethod.SignTransaction;
  payload: SolanaTransactionRequest;
  chain: Chain.Solana;
};

export type SolanaSignAllTransactionsDappRequestProps = {
  id: number;
  type: RequestType.SignTransaction;
  method: SolanaMethod.SignAllTransactions;
  payload: SolanaTransactionRequest;
  chain: Chain.Solana;
};

export type DappRequestProps =
  | EthereumConnectDappDappRequestProps
  | EthereumSignAndSendTransactionDappRequestProps
  | EthereumSignPersonalMessageDappRequestProps
  | SolanaConnectDappDappRequestProps
  | SolanaSignAndSendTransactionDappRequestProps
  | SolanaSignTransactionDappRequestProps
  | SolanaSignAllTransactionsDappRequestProps;

export class DappRequest<Props extends DappRequestProps = DappRequestProps> extends ValueObject<Props> {
  public getID(): number {
    return this.props.id;
  }

  public getType(): RequestType {
    return this.props.type;
  }

  public getMethod(): Props['method'] {
    return this.props.method;
  }

  public getPayload(): Props['payload'] {
    return this.props.payload;
  }

  public getChain(): Chain {
    return this.props.chain;
  }

  public static create<Props extends DappRequestProps>(props: Props): DappRequest<Props> {
    return new DappRequest(props);
  }
}
