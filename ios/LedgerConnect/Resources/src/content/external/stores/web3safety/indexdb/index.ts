import { ValueObjectProps } from '../../../../../library/ddd-core-objects/value-object';
import { CachedTxInfo, FindQuery } from './types';

export const DB_WEB3SAFETY = 'web3safety';

export const STORE_WALLET_TRANSACTIONS_RECIPIENTS = 'walletTransactionsRecipients';

export enum Indexes {
  To = 'idx_to',
  ToFrom = 'idx_to_from',
  BlockNumber = 'idx_block_number',
  Timestamp = 'idx_timestamp',
}

export const IndexFields: ValueObjectProps<string | string[]> = {
  [Indexes.To]: 'to',
  [Indexes.ToFrom]: ['to', 'from'],
  [Indexes.BlockNumber]: 'blockNumber',
  [Indexes.Timestamp]: 'timestamp',
};

const databases: ValueObjectProps<IDBDatabase> = {};

export const getDb = async (
  databaseName = DB_WEB3SAFETY,
  storeName = STORE_WALLET_TRANSACTIONS_RECIPIENTS,
  options = { keyPath: 'hash' },
): Promise<IDBDatabase> => {
  if (databases[databaseName]) {
    return databases[databaseName];
  }

  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(databaseName, 4);

    request.onerror = () => reject(new Error(`Unable to open database ${databaseName}`));

    request.onsuccess = function onsucess() {
      databases[databaseName] = request.result;
      resolve(request.result);
    };

    request.onupgradeneeded = function onupgradeneeded() {
      const db: IDBDatabase = this.result;

      const store = db.createObjectStore(storeName, options);
      store.createIndex(Indexes.To, IndexFields[Indexes.To]);
      store.createIndex(Indexes.ToFrom, IndexFields[Indexes.ToFrom]);
      store.createIndex(Indexes.BlockNumber, IndexFields[Indexes.BlockNumber]);
      store.createIndex(Indexes.Timestamp, IndexFields[Indexes.Timestamp]);
    };
  });
};

export const put = async (
  info: CachedTxInfo,
  db: IDBDatabase,
  storeName = STORE_WALLET_TRANSACTIONS_RECIPIENTS,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    transaction.oncomplete = () => resolve(true);
    transaction.onerror = (event) => reject(event);

    const store = transaction.objectStore(storeName);
    store.put(info);
  });
};

export const putMany = async (
  infos: CachedTxInfo[],
  db: IDBDatabase,
  storeName = STORE_WALLET_TRANSACTIONS_RECIPIENTS,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    transaction.oncomplete = () => resolve(true);
    transaction.onerror = (event) => reject(event);

    const store = transaction.objectStore(storeName);
    infos.forEach((info) => store.put(info));
  });
};

export const find = async (
  query: FindQuery,
  db: IDBDatabase,
  storeName = STORE_WALLET_TRANSACTIONS_RECIPIENTS,
): Promise<CachedTxInfo | CachedTxInfo[] | null> => {
  return new Promise((resolve) => {
    const { values, index: indexName } = query;

    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.get(values);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => resolve(null);
  });
};
