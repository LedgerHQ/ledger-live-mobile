import { convert } from 'ethereumjs-units';
import { ValueObjectProps } from '../../../../library/ddd-core-objects/value-object';
import { domainsWhitelist } from '../../../../library/web3safety/domains-whitelist';
import { CachedTxInfo } from './indexdb/types';
import {
  SearchEvent,
  EtherscanResponse,
  TransactionEstimationOptions,
  TransactionEstimationInfo,
  NetworkInformation,
} from '../../../../library/web3safety/types';
import { getLogger, getErrorLogger } from '../../../../logging';
import { Chain } from '../../../domain/chain';
import * as indexdb from './indexdb';
import { config } from '../../../../library/web3safety/config';

const ETHERSCAN_API_KEY = 'JYE284NYG3617NE75U55UYZD3APBNY3SFB';

const log = getLogger('web3safety');
const logError = getErrorLogger('web3safety');

export const getLatestBlockNo = async (): Promise<number | null> => {
  const db = await indexdb.getDb();
  const transaction = db.transaction([indexdb.STORE_WALLET_TRANSACTIONS_RECIPIENTS], 'readonly');
  const objectStore = transaction.objectStore(indexdb.STORE_WALLET_TRANSACTIONS_RECIPIENTS);
  const index = objectStore.index(indexdb.Indexes.BlockNumber);
  const request = index.openCursor(null, 'prev');
  let blockNumber: number | null = null;

  return new Promise((resolve) => {
    request.onsuccess = (event) => {
      blockNumber = (event as SearchEvent)?.target?.result?.value?.blockNumber || null;
      log(`getLatestBlockNo:: blockNumber=${blockNumber}`);
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
      // logError(json.message);
      return false;
    }

    log(`etherscanLoader:: loaded ${json.result.length} tx info for address ${address} from block ${startBlock}`);

    const db = await indexdb.getDb();

    indexdb.putMany(
      json.result.map((row: CachedTxInfo) => ({
        ...row,
        blockNumber: parseInt(`${row.blockNumber}`, 10),
        timeStamp: parseInt(`${row.timeStamp}`, 10),
      })),
      db,
    );
  } catch (error) {
    logError(`update txs error`, error);
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

  log(`isFirstTransaction:: found1=${found1}, found2=${found2}`);

  return !!(found1 || found2);
};

export const updateTransactions = async (address: string): Promise<void> => {
  const block = await getLatestBlockNo();
  await etherscanLoader(address, block || 0);
};

export const isDomainWhitelisted = (domain: string, chain: Chain): boolean => {
  return !!domainsWhitelist.find((item) => item.domain === domain && item.chain === chain);
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
      logError(json.message);
      return false;
    }

    const [createTx] = json.result;

    log(`isContractOlderThan:: contract at address ${address} created in tx`, createTx);

    const ts = parseInt(`${createTx.timeStamp}`, 10) * 1000;
    const now = new Date().getTime();

    return now - ts > ageMs;
  } catch (error) {
    logError(`update txs error`, error);
  }

  return false;
};

export const estimateTransaction = async (
  opts: TransactionEstimationOptions,
): Promise<TransactionEstimationInfo | null> => {
  try {
    const result = await fetch('https://api.blocknative.com/simulate', {
      method: 'POST',
      headers: {
        credentials: `${config.blocknative.apiKey}:${config.blocknative.apiSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system: 'ethereum',
        network: 'main',
        transaction: {
          from: opts.address,
          to: opts.contract,
          gas: parseInt(opts.gas, 16),
          gasPrice: opts.gasPrice ? parseInt(convert(opts.gasPrice, 'gwei', 'wei'), 10) : 0,
          input: opts.txData || '',
          value: opts.value ? parseInt(opts.value, 16) : 0,
        },
      }),
    });

    const json: TransactionEstimationInfo = await result.json();

    console.log('>>> estimateTransaction:: json', json);

    return json;
  } catch (error) {
    console.log('>>> estimateTransaction:: err', error);
    throw new Error('Unable to estimate gas');
  }
};

export const getExchangeRates = async (crypto: string, fiat = 'usd'): Promise<number> => {
  return fetch(`https://countervalues.live.ledger.com/hourly/${crypto}/${fiat}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((json: ValueObjectProps<number>) => {
      console.log('>>> getExchangeRates:: crypto-fiat', crypto, fiat, json);
      const [, rate] = Object.entries(json).reverse()[0];
      return rate;
    })
    .catch((error) => {
      logError(error);
      return 0.0;
    });
};

export const convertEstimationToNetworkInfo = async (info: TransactionEstimationInfo): Promise<NetworkInformation> => {
  const exchangeRateUsd = await getExchangeRates('ETH', 'USD');
  const balanceChange = info.netBalanceChanges.find((c) => c.address === info.from);
  const impactEth = convert(balanceChange ? balanceChange.delta : '0', 'wei', 'eth');

  return {
    networkFeeUSD: `$${exchangeRateUsd * parseFloat(convert(info.gas * info.gasPrice, 'wei', 'eth'))}`,
    networkFeeETH: `${convert(info.gas, 'wei', 'eth')} ETH`,
    processingTime: '~ 2-3 min',
    predictedImpact: impactEth,
  };
};

export const simulate = async (opts: TransactionEstimationOptions): Promise<NetworkInformation | null> => {
  const estimation = await estimateTransaction({
    address: opts.address,
    contract: opts.contract,
    gas: opts.gas,
    gasPrice: opts.gasPrice,
    value: opts.value,
  });

  if (!estimation) {
    return null;
  }

  const networkInfo: NetworkInformation = await convertEstimationToNetworkInfo(estimation);
  log('simulate:: networkInfo', networkInfo);

  return networkInfo;
};
