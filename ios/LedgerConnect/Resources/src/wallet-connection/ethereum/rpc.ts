// Copyright © 2017-2020 Trust Wallet.
//
// This file is part of Trust. The full Trust copyright notice, including
// terms governing use, modification, and redistribution, is contained in the
// file LICENSE at the root of the source code distribution tree.

import { Payload } from '.';

export class RPCServer {
  rpcUrl: any;

  constructor(rpcUrl: any) {
    this.rpcUrl = rpcUrl;
  }

  getBlockNumber() {
    return this.call({
      id: 0,
      jsonrpc: '2.0',
      method: 'eth_blockNumber',
      params: [],
    }).then((json) => json.result);
  }

  getBlockByNumber(number: any) {
    return this.call({
      id: 0,
      jsonrpc: '2.0',
      method: 'eth_getBlockByNumber',
      params: [number, false],
    }).then((json) => json.result);
  }

  getFilterLogs(filter: any) {
    return this.call({
      id: 0,
      jsonrpc: '2.0',
      method: 'eth_getLogs',
      params: [filter],
    });
  }

  async call(payload: Payload) {
    if (payload.jsonrpc == null) {
      payload.jsonrpc = '2.0';
    }
    return fetch(this.rpcUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((json) => {
        if (!json.result && json.error) {
          console.log('<== rpc error', json.error);
          throw new Error(json.error.message || 'rpc error');
        }
        return json;
      });
  }
}

// module.exports = RPCServer;
