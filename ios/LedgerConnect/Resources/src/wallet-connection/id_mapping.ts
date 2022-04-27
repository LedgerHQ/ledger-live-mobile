// Copyright © 2017-2020 Trust Wallet.
//
// This file is part of Trust. The full Trust copyright notice, including
// terms governing use, modification, and redistribution, is contained in the
// file LICENSE at the root of the source code distribution tree.

import { Utils } from './utils';

export class IdMapping {
  intIds: any;

  constructor() {
    this.intIds = new Map();
  }

  genId() {
    return new Date().getTime() + Math.floor(Math.random() * 1000);
  }

  tryRestoreId(payload: { id: any }) {
    let id = this.tryPopId(payload.id);
    if (id) {
      payload.id = id;
    }
  }

  tryPopId(id: any) {
    let originId = this.intIds.get(id);
    if (originId) {
      this.intIds.delete(id);
    }
    return originId;
  }
}

// module.exports = IdMapping;
