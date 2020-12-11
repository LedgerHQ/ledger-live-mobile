// @flow

import AsyncStorage from "@react-native-community/async-storage";
import { makeBridgeCacheSystem } from "@ledgerhq/live-common/lib/bridge/cache";
import { log } from "@ledgerhq/logs";
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";

export async function clearBridgeCache() {
  const keys = await AsyncStorage.getAllKeys();
  await AsyncStorage.multiRemove(
    keys.filter(k => k.startsWith("bridgeproxypreload")),
  );
}

function currencyCacheId(currency) {
  return `bridgeproxypreload_${currency.id}`;
}

export async function setCurrencyCache(currency: CryptoCurrency, data: mixed) {
  if (data) {
    const serialized = JSON.stringify(data);
    await AsyncStorage.setItem(currencyCacheId(currency), serialized);
  }
}

export async function getCurrencyCache(currency: CryptoCurrency): mixed {
  const res = await AsyncStorage.getItem(currencyCacheId(currency));
  if (res) {
    try {
      return JSON.parse(res);
    } catch (e) {
      log("bridge/cache", `failure to retrieve cache ${String(e)}`);
    }
  }
  return undefined;
}

const cache = makeBridgeCacheSystem({
  saveData: setCurrencyCache,
  getData: getCurrencyCache,
});

export const hydrateCurrency = cache.hydrateCurrency;
export const prepareCurrency = cache.prepareCurrency;
