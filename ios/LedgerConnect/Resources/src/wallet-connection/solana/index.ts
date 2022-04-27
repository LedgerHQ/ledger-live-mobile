/* eslint-disable */
import assert from 'assert';
import { EventEmitter, WalletPublicKeyError } from '@solana/wallet-adapter-base';
import { PublicKey, SendOptions, SerializeConfig, Transaction } from '@solana/web3.js';
import { Chain } from '../../content/domain/chain';
import { SolanaRawDappRequestDTO } from '../../content/external/maps/dto/chain/solana-dapp-request-map';
import { RequestType, SolanaMethod } from '../../content/use-case/dto/dapp-request';
import {
  ExtensionComponent,
  ExtensionMessageRequest,
  ExtensionMessageResponse,
} from '../../messaging';
import { getLogger } from '../../logging';
import { IdMapping } from '../id_mapping';
import { Utils } from '../utils';

const log = getLogger('solana');

interface RPCCallback {
  (error: any, data: unknown): void;
}

const requestTypeMap: { [key in string]: RequestType } = {
  solana_getAccount: RequestType.ConnectDapp,
  solana_signAndSendTransaction: RequestType.SignAndSendTransaction,
  solana_signTransaction: RequestType.SignTransaction,
};

class LedgerConnectWallet extends EventEmitter {
  // TODO: change to isLedgerConnect
  isPhantom?: boolean = true;
  publicKey?: PublicKey;
  isConnected: boolean = false;

  private idMapping: IdMapping;
  private callbacks: Map<number, RPCCallback>;
  private wrapResults: Map<number, any>;
  private isDebug: boolean = true;

  // TODO: Move this logic out of here
  pendingTx: Transaction | undefined;

  constructor() {
    super();

    this.idMapping = new IdMapping();
    this.callbacks = new Map<any, any>();
    this.wrapResults = new Map<any, any>();

    this.createEventListener();
  }

  signTransaction(transaction: Transaction): Promise<Transaction> {
    const serializedTransactionsHex = [this.serializeTransaction(transaction)];
    const publicKeyBase58 = this.publicKey?.toBase58();
    assert(publicKeyBase58, 'publicKeyBase58 must be set');

    const payload: SolanaRawDappRequestDTO = {
      id: Utils.genId(),
      type: RequestType.SignTransaction,
      method: SolanaMethod.SignTransaction,
      chain: Chain.Solana,
      payload: {
        publicKeyBase58,
        serializedTransactionsHex,
      },
    };

    this.pendingTx = transaction;

    return this.storeCallbackAndPostMessage(payload);
  }

  signAllTransactions(transactions: Transaction[]): Promise<Transaction[]> {
    const serializedTransactionsHex = transactions.map((tx) => this.serializeTransaction(tx));
    const publicKeyBase58 = this.publicKey?.toBase58();
    assert(publicKeyBase58, 'publicKeyBase58 must be set');

    const payload: SolanaRawDappRequestDTO = {
      id: Utils.genId(),
      type: RequestType.SignTransaction,
      method: SolanaMethod.SignAllTransactions,
      chain: Chain.Solana,
      payload: {
        serializedTransactionsHex,
        publicKeyBase58,
      },
    };

    return this.storeCallbackAndPostMessage(payload);
  }

  signAndSendTransaction(transaction: Transaction, options?: SendOptions): Promise<{ signature: string }> {
    const serializedTransactionsHex = [this.serializeTransaction(transaction)];
    const publicKeyBase58 = this.publicKey?.toBase58();
    assert(publicKeyBase58, 'publicKeyBase58 must be set');

    const payload: SolanaRawDappRequestDTO = {
      id: Utils.genId(),
      type: RequestType.SignAndSendTransaction,
      method: SolanaMethod.SignAndSendTransaction,
      chain: Chain.Solana,
      payload: {
        serializedTransactionsHex,
        publicKeyBase58,
      },
    };

    this.pendingTx = transaction;

    return this.storeCallbackAndPostMessage(payload);
  }

  connect(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      log(`connect()`);

      try {
        let account = await this.getAccount();
        this.publicKey = new PublicKey(account);
      } catch (error: any) {
        throw new WalletPublicKeyError(error?.message, error);
      }

      this.isConnected = true;

      // TODO: might not need this once we're using a LedgerConnect adapter
      // instead of Phantom
      this.emit('connect');
      resolve();
    });
  }

  disconnect(): Promise<void> {
    this.publicKey = undefined;
    return Promise.resolve();
  }

  private getAccount(): Promise<string> {
    let payload: SolanaRawDappRequestDTO = {
      id: Utils.genId(),
      type: RequestType.ConnectDapp,
      method: SolanaMethod.ConnectDapp,
      chain: Chain.Solana,
      payload: undefined,
    };

    return this.storeCallbackAndPostMessage(payload);
  }

  private serializeTransaction(transaction: Transaction): string {
    const config: SerializeConfig = { requireAllSignatures: false, verifySignatures: false };
    return transaction.serialize(config).toString('hex');
  }

  private deserializeTransaction(serializedTransactionHex: string): Transaction {
    const buffer = Buffer.from(serializedTransactionHex, 'hex');
    return Transaction.from(buffer);
  }

  private createEventListener() {
    window.addEventListener('message', async (event: MessageEvent<ExtensionMessageResponse>) => {
      let message = event.data;
      if (message.destination !== ExtensionComponent.solana) {
        return;
      }

      const { method, id, payload } = message.response;

      log(`received response for method ${method}`, payload);

      let mappedPayload: any;

      switch (method) {
        case SolanaMethod.SignAllTransactions:
          mappedPayload = payload.map((transaction: string) => this.deserializeTransaction(transaction));
          break;
        case SolanaMethod.SignTransaction:
          mappedPayload = this.deserializeTransaction(payload);
          break;
        default:
          mappedPayload = payload;
      }

      this.sendResponse(id, mappedPayload);
    });
  }

  // Saves the callback and posts a message to the content script
  private storeCallbackAndPostMessage(request: SolanaRawDappRequestDTO): Promise<any> {
    log(`==> _request payload ${JSON.stringify(request)}`);

    return new Promise((resolve, reject) => {
      this.callbacks.set(request.id, (error: any, data: unknown) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
      this.wrapResults.set(request.id, false);
      this.postMessage(request);
    });
  }

  // js -> native message handler
  private postMessage(request: SolanaRawDappRequestDTO) {
    log(`posting message: ${request.method}`);

    const object: ExtensionMessageRequest = {
      sender: ExtensionComponent.solana,
      destination: ExtensionComponent.content,
      request,
    };

    window.postMessage(object);
  }

  // native result -> js
  private sendResponse(id: number, result: any) {
    let originId = this.idMapping.tryPopId(id) || id;
    let callback = this.callbacks.get(id);
    let wrapResult = this.wrapResults.get(id);

    let data: {
      jsonrpc: string;
      id: any;
      result: any;
    };
    data = { jsonrpc: '2.0', id: originId, result: null };

    if (((result = result as Response), result.jsonrpc && result.result)) {
      data.result = result.result;
    } else {
      data.result = result;
    }
    if (this.isDebug) {
      log(`<== sendResponse id: ${id}, result: ${JSON.stringify(result)}`);
    }
    if (callback) {
      log(`callback id: ${id} found, calling with result: ${result}`);
      wrapResult ? callback(null, data) : callback(null, result);
      this.callbacks.delete(id);
    } else {
      // check if it's iframe callback
      for (var i = 0; i < window.frames.length; i++) {
        const frame = window.frames[i];
        try {
          if (frame.ethereum.callbacks.has(id)) {
            frame.ethereum.sendResponse(id, result);
          }
        } catch (error) {
          log(`send response to frame error: ${error}`);
        }
      }
    }
  }
}

// TODO: change this to .ledgerConnectSolana
(window as any).solana = new LedgerConnectWallet();

log('loaded');

export default LedgerConnectWallet;
