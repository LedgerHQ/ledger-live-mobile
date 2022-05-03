import { Transaction } from '@solana/web3.js';
import { EthereumMethod, RequestType, SolanaMethod } from './dapp-request';
import { ValueObject } from '../../../library/ddd-core-objects';
import { Chain } from '../../domain/chain';
import { Account } from '../../domain/ledger/account';
import { TransactionHash } from '../../domain/transaction/ethereum/transaction-hash';
import { Signature } from '../../domain/transaction/solana/signature';
import { PersonalMessageSignature } from '../../domain/personal-message/ethereum/personal-message-signature';

/* Ethereum */

export type EthereumConnectDappDappResponseProps = {
  id: number;
  type: RequestType.ConnectDapp;
  method: EthereumMethod.ConnectDapp;
  payload: Account[];
  chain: Chain.Ethereum;
};

export type EthereumSignAndSendTransactionDappResponseProps = {
  id: number;
  type: RequestType.SignAndSendTransaction;
  method: EthereumMethod.SignAndSendTransaction;
  payload: TransactionHash | undefined;
  chain: Chain.Ethereum;
};

export type EthereumSignPersonalMessageDappResponseProps = {
  id: number;
  type: RequestType.SignPersonalMessage;
  method: EthereumMethod.SignPersonalMessage;
  payload: PersonalMessageSignature;
  chain: Chain.Ethereum;
};

/* Solana */

export type SolanaConnectDappDappResponseProps = {
  id: number;
  type: RequestType.ConnectDapp;
  method: SolanaMethod.ConnectDapp;
  payload: Account | undefined;
  chain: Chain.Solana;
};

export type SolanaSignAndSendTransactionDappResponseProps = {
  id: number;
  type: RequestType.SignAndSendTransaction;
  method: SolanaMethod.SignAndSendTransaction;
  payload: Signature;
  chain: Chain.Solana;
};

export type SolanaSignTransactionDappResponseProps = {
  id: number;
  type: RequestType.SignTransaction;
  method: SolanaMethod.SignTransaction;
  payload: Transaction;
  chain: Chain.Solana;
};

export type SolanaSignAllTransactionsDappResponseProps = {
  id: number;
  type: RequestType.SignTransaction;
  method: SolanaMethod.SignAllTransactions;
  payload: Transaction[];
  chain: Chain.Solana;
};

export type DappResponseProps =
  | EthereumConnectDappDappResponseProps
  | EthereumSignAndSendTransactionDappResponseProps
  | EthereumSignPersonalMessageDappResponseProps
  | SolanaConnectDappDappResponseProps
  | SolanaSignAndSendTransactionDappResponseProps
  | SolanaSignTransactionDappResponseProps
  | SolanaSignAllTransactionsDappResponseProps;

export class DappResponse<Props extends DappResponseProps = DappResponseProps> extends ValueObject<Props> {
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

  public static create<Props extends DappResponseProps>(props: Props): DappResponse<Props> {
    return new DappResponse(props);
  }
}
