import { whitelist } from './domains-whitelist';
import * as indexdb from './indexdb';

interface EtherscanResponse {
  status: '1' | '0';
  message: string;
  result: indexdb.CachedTxInfo[];
}

interface SearchEvent extends Event {
  target: IDBRequest;
}

const ETHERSCAN_API_KEY = 'JYE284NYG3617NE75U55UYZD3APBNY3SFB';

export const getLatestBlockNo = async (): Promise<number | null> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    const db = await indexdb.getDb();
    const transaction = db.transaction([indexdb.STORE_WALLET_TRANSACTIONS_RECIPIENTS], 'readonly');
    const objectStore = transaction.objectStore(indexdb.STORE_WALLET_TRANSACTIONS_RECIPIENTS);
    const index = objectStore.index(indexdb.Indexes.BlockNumber);
    const request = index.openCursor(null, 'prev');
    let blockNumber: number | null = null;

    request.onsuccess = (event) => {
      blockNumber = (event as SearchEvent)?.target?.result?.value?.blockNumber || null;
    };

    transaction.oncomplete = () => resolve(blockNumber);
  });
};

export const etherscanLoader = async (address: string, startBlock = 0): Promise<boolean> => {
  const url =
    `https://api.etherscan.io/api?module=account` +
    `&action=txlist` +
    `&address=${address}` +
    `&startblock=${startBlock}` +
    `&endblock=99999999` +
    `&sort=asc` +
    `&apikey=${ETHERSCAN_API_KEY}`;

  try {
    const result = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const json: EtherscanResponse = await result.json();

    if (json.status === '0') {
      // console.error(json.message);
      return false;
    }

    const db = await indexdb.getDb();

    indexdb.putMany(
      json.result.map((row: indexdb.CachedTxInfo) => ({
        ...row,
        blockNumber: parseInt(`${row.blockNumber}`, 10),
        timeStamp: parseInt(`${row.timeStamp}`, 10),
      })),
      db,
    );
  } catch (error) {
    // console.error(`update txs error`, error);
    return false;
  }

  return true;
};

export const isFirstTransaction = async (address: string, recipient: string): Promise<boolean> => {
  const db = await indexdb.getDb();
  const found1 = await indexdb.find(
    {
      index: indexdb.Indexes.ToFrom,
      values: [address, recipient],
    },
    db,
  );
  const found2 = await indexdb.find(
    {
      index: indexdb.Indexes.ToFrom,
      values: [recipient, address],
    },
    db,
  );

  return !!(found1 || found2);
};

export const updateTransactions = async (address: string): Promise<void> => {
  const block = await getLatestBlockNo();
  await etherscanLoader(address, block || 0);
};

export const isContractWhitelisted = (address: string): boolean => {
  return !!whitelist.find((item) => item.address === address);
};

export const isContractOlderThan = async (address: string, ageMs: number): Promise<boolean> => {
  const url =
    `https://api.etherscan.io/api?module=account` +
    `&action=txlist` +
    `&address=${address}` +
    `&sort=asc` +
    `&page=1` +
    `&offset=1` +
    `&apikey=${ETHERSCAN_API_KEY}`;

  try {
    const result = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const json: EtherscanResponse = await result.json();

    if (json.status === '0' || !json.result.length) {
      // console.error(json.message);
      return false;
    }

    const [createTx] = json.result;

    const ts = parseInt(`${createTx.timeStamp}`, 10) * 1000;
    const now = new Date().getTime();

    return now - ts > ageMs;
  } catch (error) {
    // console.error(`update txs error`, error);
  }

  return false;
};
