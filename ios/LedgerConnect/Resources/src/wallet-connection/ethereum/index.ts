/* eslint-disable */
import { EventEmitter } from 'events';
import isUtf8 from 'isutf8';
import { TypedDataUtils } from 'eth-sig-util';
import { convert } from 'ethereumjs-units';
import {
  ExtensionComponent,
  ExtensionMessageRequest,
  ExtensionMessageResponse,
} from '../../messaging';
import { getLogger } from '../../logging';
import { RPCServer } from './rpc';
import { ProviderRpcError } from './error';
import { Utils } from '../utils';
import { IdMapping } from '../id_mapping';
import { EthereumRawDappRequestDTO } from '../../content/external/maps/dto/chain/ethereum-dapp-request-map';
import { EthereumMethod, RequestType } from '../../content/use-case/dto/dapp-request';
import { Chain } from '../../content/domain/chain';

// MARK: - Setup

declare global {
  interface Window {
    ethereum: any;
  }
}

export interface Config {
  isDebug: boolean;
  chainId: string;
  address?: string;
  rpcUrl: string;
}

export interface Payload {
  id: number;
  method: string;
  params: any[];
  jsonrpc: '2.0';
}

interface Response {
  jsonrpc: string;
  id: any;
  result: any;
}

interface GasPrice {
  confidence: number;
  price: number;
  maxPriorityFeePerGas: number;
  maxFeePerGas: number;
}

const log = getLogger('ethereum');

// MARK: - Class

class Ethereum extends EventEmitter {
  private chainId: string;
  private address: string;
  private networkVersion: string;

  private idMapping: IdMapping;
  private ready: boolean;
  private rpc: RPCServer;
  private callbacks: Map<number, any>;
  private wrapResults: Map<number, any>;
  private isDebug: boolean;

  constructor(config: Config) {
    super();

    log(`Ethereum constructed with config: ${JSON.stringify(config)}`);

    this.networkVersion = '' + config.chainId;
    this.chainId = '0x' + (config.chainId || 1).toString(16);
    this.address = '';

    this.ready = false;
    this.rpc = new RPCServer(config.rpcUrl);

    this.setConfig(config);

    this.idMapping = new IdMapping();
    this.callbacks = new Map<any, any>();
    this.wrapResults = new Map<any, any>();
    // this.isDebug = !!config.isDebug;
    this.isDebug = true;

    this.emitConnect(config.chainId);

    window.addEventListener('message', async (event: MessageEvent<ExtensionMessageResponse>) => {
      const message = event.data;
      if (message.destination === ExtensionComponent.ethereum) {
        log(`received response for id ${message.response.id}`, event.data);

        const id = message.response.id;
        const payload = message.response.payload;

        if (this.callbacks.get(id) == null) {
          log('Could not find id', id, '. Ignoring.');
          return;
        }

        switch (message.response.method) {
          case 'eth_requestAccounts':
            this.setAddress(payload[0]);
            break;
        }

        this.sendResponse(id, payload);
        this.close();
      }
    });
  }

  setAddress(address: string) {
    const lowerAddress = (address || '').toLowerCase();
    this.address = lowerAddress;
    this.ready = !!address;
    for (var i = 0; i < window.frames.length; i++) {
      const frame = window.frames[i];
      if (frame.ethereum && frame.ethereum.isTrust) {
        frame.ethereum.address = lowerAddress;
        frame.ethereum.ready = !!address;
      }
    }
  }

  setConfig(config: any) {
    this.setAddress(config.address);

    this.chainId = config.chainId;
    this.rpc = new RPCServer(config.rpcUrl);
    this.isDebug = !!config.isDebug;
  }

  request(payload: Payload) {
    // this points to window in methods like web3.eth.getAccounts()
    var that = this;
    if (!(this instanceof Ethereum)) {
      that = window.ethereum;
    }
    return that._request(payload, false);
  }

  /**
   * @deprecated Listen to "connect" event instead.
   */
  isConnected() {
    return true;
  }

  /**
   * @deprecated Use request({method: "eth_requestAccounts"}) instead.
   */
  enable() {
    log('enable() is deprecated, please use window.ethereum.request({method: "eth_requestAccounts"}) instead.');

    return this.request({
      id: Utils.genId(),
      method: 'eth_requestAccounts',
      params: [],
      jsonrpc: '2.0',
    });
  }

  /**
   * @deprecated Use request() method instead.
   */
  send(payload: Payload): Response {
    if (this.isDebug) {
      console.log(`==> send payload ${JSON.stringify(payload)}`);
    }

    let response: Response = {
      jsonrpc: '2.0',
      id: payload.id,
      result: null,
    };

    switch (payload.method) {
      // case 'eth_accounts':
      //     response.result = this.eth_accounts(payload);
      //     break;
      case 'eth_coinbase':
        response.result = this.eth_coinbase();
        break;
      case 'net_version':
        response.result = this.net_version();
        break;
      case 'eth_chainId':
        response.result = this.eth_chainId();
        break;
      default:
        throw new ProviderRpcError(
          4200,
          `Ledger Connect does not support calling ${payload.method} synchronously without a callback. Please provide a callback parameter to call ${payload.method} asynchronously.`,
        );
    }
    return response;
  }

  /**
   * @deprecated Use request() method instead.
   */
  sendAsync(payload: Payload, callback: (arg0: null, arg1: unknown) => any) {
    log('sendAsync(data, callback) is deprecated, please use window.ethereum.request(data) instead.');
    // this points to window in methods like web3.eth.getAccounts()
    var that = this;
    if (!(this instanceof Ethereum)) {
      that = window.ethereum;
    }

    if (Array.isArray(payload)) {
      log('*** unhandled payload type ***');
      // Promise.all(payload.map(that._request.bind(that)))
      //     .then((data) => callback(null, data))
      //     .catch((error) => callback(error, null));
    } else {
      that
        ._request(payload)
        .then((data) => callback(null, data))
        .catch((error) => callback(error, null));
    }
  }

  /**
   * @private Internal rpc handler
   */
  _request(payload: Payload, wrapResult = true) {
    console.log('_request', payload);

    if (this.isDebug) {
      log(`==> _request payload ${JSON.stringify(payload)}`);
    }
    return new Promise((resolve, reject) => {
      if (!payload.id) {
        payload.id = Utils.genId();
      }
      this.callbacks.set(payload.id, (error: any, data: unknown) => {
        if (error) {
          log('rejecting with', payload.id, error);
          reject(error);
        } else {
          log('resolving with', payload.id, data);
          resolve(data);
        }
      });
      this.wrapResults.set(payload.id, wrapResult);

      switch (payload.method) {
        case 'eth_accounts':
          return this.eth_accounts(payload);
        // return this.sendResponse(payload.id, this.eth_accounts());
        case 'eth_coinbase':
          return this.sendResponse(payload.id, this.eth_coinbase());
        case 'net_version':
          return this.sendResponse(payload.id, this.net_version());
        case 'eth_chainId':
          return this.sendResponse(payload.id, this.chainId);
        case 'eth_sign':
          return this.eth_sign(payload);
        case 'personal_sign':
          return this.personal_sign(payload);
        case 'personal_ecRecover':
          return this.personal_ecRecover(payload);
        case 'eth_signTypedData_v3':
          return this.eth_signTypedData(payload, false);
        case 'eth_signTypedData':
        case 'eth_signTypedData_v4':
          return this.eth_signTypedData(payload, true);
        case 'eth_sendTransaction':
          return this.eth_sendTransaction(payload);
        case 'eth_requestAccounts':
          return this.eth_requestAccounts(payload);
        case 'wallet_requestPermissions':
          // Doesn't seem to work on metamask test dapp
          return this.sendResponse(payload.id, []);
        case 'wallet_getPermissions':
          let permissions = {
            invoker: window.location.href,
            parentCapability: 'eth_accounts',
            caveats: [],
          };
          return this.sendResponse(payload.id, [permissions]);
        case 'wallet_watchAsset':
          return this.wallet_watchAsset(payload);
        case 'wallet_addEthereumChain':
          return this.wallet_addEthereumChain(payload);
        case 'wallet_switchEthereumChain':
          return this.sendResponse(payload.id, this.chainId);
        // return this.wallet_switchEthereumChain(payload);
        case 'eth_newFilter':
        case 'eth_newBlockFilter':
        case 'eth_newPendingTransactionFilter':
        case 'eth_uninstallFilter':
        case 'eth_subscribe':
          throw new ProviderRpcError(
            4200,
            `Trust does not support calling ${payload.method}. Please use your own solution`,
          );
        // @ts-ignore
        case 'eth_getTransactionReceipt':
          // Workaround to handle nested tx hash from Etherscan
          if (typeof payload.params[0]['result'] === 'string') {
            payload.params = [payload.params[0]['result']];
          }
        // Fallthrough to call RPC
        default:
          // call upstream rpc
          this.callbacks.delete(payload.id);
          this.wrapResults.delete(payload.id);
          return this.rpc
            .call(payload)
            .then((response) => {
              if (this.isDebug) {
                log(`<== rpc response ${JSON.stringify(response)}`);
              }
              wrapResult ? resolve(response) : resolve(response.result);
            })
            .catch(reject);
      }
    });
  }

  emitConnect(chainId: string) {
    this.emit('connect', { chainId: chainId });
  }

  emitChainChanged(chainId: string) {
    this.emit('chainChanged', chainId);
    this.emit('networkChanged', chainId);
  }

  eth_accounts(payload: Payload) {
    if (!this.address) {
      this.eth_requestAccounts(payload);
    } else {
      this.sendResponse(payload.id, [this.address]);
    }
  }

  eth_coinbase() {
    return this.address;
  }

  net_version() {
    return this.networkVersion || null;
  }

  eth_chainId() {
    return this.chainId;
  }

  eth_sign(payload: Payload) {
    const buffer = Utils.messageToBuffer(payload.params[1]);
    const hex = Utils.bufferToHex(buffer);
    if (isUtf8(buffer)) {
      this.postMessage({
        id: payload.id,
        type: RequestType.SignPersonalMessage,
        method: EthereumMethod.SignPersonalMessage,
        chain: Chain.Ethereum,
        payload: { data: hex },
      });
    } else {
      this.sendError(payload.id, new ProviderRpcError(4100, 'unsupported method'));
      // this.postMessage('signMessage', payload.id, { data: hex });
    }
  }

  personal_sign(payload: Payload) {
    const message = payload.params[0];
    const buffer = Utils.messageToBuffer(message);

    const data = buffer.length === 0 ? Utils.bufferToHex(message) : message;

    this.postMessage({
      id: payload.id,
      type: RequestType.SignPersonalMessage,
      method: EthereumMethod.SignPersonalMessage,
      chain: Chain.Ethereum,
      payload: { data },
    });
  }

  personal_ecRecover(payload: Payload) {
    // this.postMessage('ecRecover', payload.id, {
    //   signature: payload.params[1],
    //   message: payload.params[0],
    // });
    this.sendError(payload.id, new ProviderRpcError(4100, 'unsupported method'));
  }

  eth_signTypedData(payload: Payload, useV4: boolean | undefined) {
    const message = JSON.parse(payload.params[1]);
    const hash = TypedDataUtils.sign(message, useV4);
    // this.postMessage('signTypedMessage', payload.id, {
    //   data: '0x' + hash.toString('hex'),
    //   raw: payload.params[1],
    // });
    this.sendError(payload.id, new ProviderRpcError(4100, 'unsupported method'));
  }

  async eth_sendTransaction(payload: Payload) {
    let params: any = payload.params;

    params[0]['nonce'] = await this.getLatestTxCount(this.address);

    // Some dapps leave this empty for non-ETH transfers and we currently
    // expect it to be a string.
    if (!params[0]['value']) {
      params[0]['value'] = '0x0';
    }

    await this.setGasValues(this.chainId, params);

    if (this.isDebug) {
      this.logParams(params);
    }

    this.postMessage({
      id: payload.id,
      type: RequestType.SignAndSendTransaction,
      method: EthereumMethod.SignAndSendTransaction,
      chain: Chain.Ethereum,
      payload: params[0],
    });
  }

  logParams(params: any) {
    log(`ropsten maxFeePerGas: ${convert(Number(params[0]['maxFeePerGas']), 'wei', 'gwei')}`);
    log(`ropsten maxPriorityFeePerGas: ${convert(Number(params[0]['maxPriorityFeePerGas']), 'wei', 'gwei')}`);
    log(`estimated gasLimit: ${Number(params[0]['gasLimit'])}`);

    log(`nonce: ${Number(params[0]['nonce'])}`);
  }

  eth_requestAccounts(payload: Payload) {
    if (!this.address) {
      this.postMessage({
        id: payload.id,
        type: RequestType.ConnectDapp,
        method: EthereumMethod.ConnectDapp,
        chain: Chain.Ethereum,
        payload: undefined,
      });
    } else {
      this.sendResponse(payload.id, [this.address]);
    }
  }

  wallet_watchAsset(payload: Payload) {
    log(`wallet_watchAsset unsupported: ${payload}`);
    this.sendError(payload.id, new ProviderRpcError(4100, 'unsupported method'));
    // let options = payload.params.options;
    // this.postMessage("watchAsset", payload.id, {
    //     type: payload.type,
    //     contract: options.address,
    //     symbol: options.symbol,
    //     decimals: options.decimals || 0,
    // });
  }

  wallet_addEthereumChain(payload: Payload) {
    // this.postMessage('addEthereumChain', payload.id, payload.params[0]);
    this.sendError(payload.id, new ProviderRpcError(4100, 'unsupported method'));
  }

  wallet_switchEthereumChain(payload: Payload) {
    // this.postMessage('switchEthereumChain', payload.id, payload.params[0]);
    this.sendError(payload.id, new ProviderRpcError(4100, 'unsupported method'));
  }

  // js -> native message handler
  postMessage(request: EthereumRawDappRequestDTO) {
    log(`posting message: ${request.method}`);
    if (this.ready || request.method === EthereumMethod.ConnectDapp) {
      let object: ExtensionMessageRequest = {
        sender: ExtensionComponent.ethereum,
        destination: ExtensionComponent.content,
        request,
      };

      window.postMessage(object);
    } else {
      // don't forget to verify in the app
      this.sendError(request.id, new ProviderRpcError(4100, 'provider is not ready'));
    }
  }

  // native result -> js
  sendResponse(id: number, result: any) {
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
      log(`callback id: ${id} found, calling with result: ${result}`, wrapResult);
      wrapResult ? callback(null, data) : callback(null, result);
      this.callbacks.delete(id);
    } else {
      log(`callback id: ${id} not found`);
      // check if it's iframe callback
      for (var i = 0; i < window.frames.length; i++) {
        const frame = window.frames[i];
        try {
          if (frame.ethereum.callbacks.has(id)) {
            log(`found frame with callback, sending response`);
            frame.ethereum.sendResponse(id, result);
          }
        } catch (error) {
          log(`send response to frame error: ${error}`);
        }
      }
    }
  }

  /**
   * @private Internal native error -> js
   */
  sendError(id: any, error: string | ProviderRpcError | undefined) {
    log(`<== ${id} sendError ${error}`);
    let callback = this.callbacks.get(id);
    if (callback) {
      callback(error instanceof Error ? error : new Error(error), null);
      this.callbacks.delete(id);
    }
  }

  close() {
    log(`Ethereum close()`);
    window.postMessage(`cancel`);
  }

  ensureLeading0x(input: string): string {
    if (input.startsWith('0x')) {
      return input;
    } else {
      return `0x${input}`;
    }
  }

  async setGasValues(chainId: string, params: any) {
    switch (chainId) {
      case '0x1':
        const priceAndLimit = await Promise.all([this.getGasPrice(), this.estimateGasLimit(params)]);

        let gasPrice = priceAndLimit[0];
        let maxPriorityFeePerGas = convert(gasPrice.maxPriorityFeePerGas, 'gwei', 'wei');
        let maxFeePerGas = convert(gasPrice.maxFeePerGas, 'gwei', 'wei');
        params[0]['maxPriorityFeePerGas'] = '0x' + Number(maxPriorityFeePerGas).toString(16);
        params[0]['maxFeePerGas'] = '0x' + Number(maxFeePerGas).toString(16);
        params[0]['gasLimit'] = priceAndLimit[1];
        break;

      case '0x3':
        const responses = await Promise.all([
          this.getMaxPriorityFeePerGas(),
          this.getRopstenGasPrice(),
          this.estimateGasLimit(params),
        ]);

        params[0]['maxPriorityFeePerGas'] = responses[0];
        params[0]['maxFeePerGas'] = responses[1];
        params[0]['gasLimit'] = responses[2];
        break;

      default:
        break;
    }
  }

  async getLatestTxCount(address: string): Promise<string> {
    let txCountPayload: Payload = {
      id: Utils.genId(),
      method: 'eth_getTransactionCount',
      params: [address, 'pending'],
      jsonrpc: '2.0',
    };

    const response = await this.rpc.call(txCountPayload);
    return response['result'];
  }

  async getMaxPriorityFeePerGas(): Promise<string> {
    let txCountPayload: Payload = {
      id: Utils.genId(),
      method: 'eth_maxPriorityFeePerGas',
      params: [],
      jsonrpc: '2.0',
    };

    const response = await this.rpc.call(txCountPayload);
    return response['result'];
  }

  async estimateGasLimit(params: any): Promise<string> {
    let estimatedGasAmountPayload: Payload = {
      id: Utils.genId(),
      method: 'eth_estimateGas',
      params: [
        {
          from: params.from,
          to: params.to,
          value: params.value,
          data: params.data,
        },
      ],
      jsonrpc: '2.0',
    };

    const response = await this.rpc.call(estimatedGasAmountPayload);
    return response['result'];
  }

  // For testing only, since Blocknative doesn't support Ropsten
  async getRopstenGasPrice(): Promise<string> {
    let txCountPayload: Payload = {
      id: Utils.genId(),
      method: 'eth_gasPrice',
      params: [],
      jsonrpc: '2.0',
    };

    const response = await this.rpc.call(txCountPayload);
    // Double the gas price since it tends to be far too low
    const price = Math.round(Number(response['result'] * 2)).toString(16);

    return this.ensureLeading0x(price);
  }

  async getGasPrice(): Promise<GasPrice> {
    return new Promise<GasPrice>(async (resolve, reject) => {
      try {
        const response = await fetch('https://api.blocknative.com/gasprices/blockprices', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'aab43665-f779-4dbd-9e27-e057b70a16a9',
          },
        });

        const json = await response.json();

        // Return the highest confidence gas price for now
        resolve(json.blockPrices[0].estimatedPrices[0]);
      } catch (error) {
        console.error('Error while getting gas price', error);
        reject(error);
      }
    });
  }
}

// MARK: - Export

let config: Config = {
  isDebug: true,
  chainId: '0x1',
  rpcUrl: 'https://eth-mainnet.alchemyapi.io/v2/-kuNbDetSLplTph8eLySef5J8Rww1DEp',
  // chainId: '0x3',
  // rpcUrl: 'https://eth-ropsten.alchemyapi.io/v2/G5ywN3ywt4S0L-2Ai92Ub1efL3aLQWWb',
  // address: '0x51a4f8419aC902006211786a5648F0cc14aa7074',
};

(window as any).ethereum = new Ethereum(config);

log(`loaded`);

export default Ethereum;
