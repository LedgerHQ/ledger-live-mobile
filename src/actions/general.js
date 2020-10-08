// @flow
import { BigNumber } from "bignumber.js";
import { useMemo, useCallback, useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { Currency } from "@ledgerhq/live-common/lib/types";
import { isAccountDelegating } from "@ledgerhq/live-common/lib/families/tezos/bakers";
import {
  nestedSortAccounts,
  flattenSortAccounts,
  sortAccountsComparatorFromOrder,
} from "@ledgerhq/live-common/lib/account";
import { getAssetsDistribution } from "@ledgerhq/live-common/lib/portfolio";
import { useCountervaluesState } from "@ledgerhq/live-common/lib/countervalues/react";
import { calculate } from "@ledgerhq/live-common/lib/countervalues/logic";
import { accountsSelector } from "../reducers/accounts";
import {
  counterValueCurrencySelector,
  orderAccountsSelector,
} from "../reducers/settings";
import { clearBridgeCache } from "../bridge/cache";
import clearLibcore from "../helpers/clearLibcore";
import { flushAll } from "../components/DBSave";

export function useDistribution() {
  const accounts = useSelector(accountsSelector);
  const calc = useCalculateCountervalueCallback();

  return useMemo(() => {
    return getAssetsDistribution(accounts, calc, {
      minShowFirst: 6,
      maxShowFirst: 6,
      showFirstThreshold: 0.95,
    });
  }, [accounts, calc]);
}

export function useCalculateCountervalueCallback() {
  const to = useSelector(counterValueCurrencySelector);
  const state = useCountervaluesState();

  return useCallback(
    (from: Currency, value: BigNumber): ?BigNumber => {
      const countervalue = calculate(state, {
        value: value.toNumber(),
        from,
        to,
        disableRounding: true,
      });
      return typeof countervalue === "number"
        ? BigNumber(countervalue)
        : countervalue;
    },
    [to, state],
  );
}

export function useSortAccountsComparator() {
  const accounts = useSelector(orderAccountsSelector);
  const calc = useCalculateCountervalueCallback();

  return sortAccountsComparatorFromOrder(accounts, calc);
}

export function useNestedSortAccounts() {
  const accounts = useSelector(accountsSelector);
  const comparator = useSortAccountsComparator();

  return useMemo(() => nestedSortAccounts(accounts, comparator), [
    accounts,
    comparator,
  ]);
}

export function useFlattenSortAccountsEnforceHideEmptyToken() {
  const accounts = useSelector(accountsSelector);
  const comparator = useSortAccountsComparator();
  return useMemo(
    () =>
      flattenSortAccounts(accounts, comparator, {
        enforceHideEmptySubAccounts: true,
      }),
    [accounts, comparator],
  );
}

export function useHaveUndelegatedAccountsSelector() {
  const accounts = useFlattenSortAccountsEnforceHideEmptyToken();
  return useMemo(
    () =>
      accounts.some(
        acc =>
          acc.currency &&
          acc.currency.family === "tezos" &&
          !isAccountDelegating(acc),
      ),
    [accounts],
  );
}

export function useRefreshAccountsOrdering() {
  const payload = useNestedSortAccounts();
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // workaround for not reflecting the latest payload when calling refresh right after updating accounts
  useEffect(() => {
    if (!isRefreshing) {
      return;
    }
    dispatch({
      type: "SET_ACCOUNTS",
      payload,
    });
    setIsRefreshing(false);
  }, [isRefreshing, dispatch, payload]);

  return useCallback(() => {
    setIsRefreshing(true);
  }, []);
}

export function useRefreshAccountsOrderingEffect({
  onMount = false,
  onUnmount = false,
  onUpdate = false,
}: {
  onMount?: boolean,
  onUnmount?: boolean,
  onUpdate?: boolean,
}) {
  const refreshAccountsOrdering = useRefreshAccountsOrdering();

  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) {
      if (onUpdate) {
        refreshAccountsOrdering();
      }
    } else {
      didMount.current = true;
    }

    if (onMount) {
      refreshAccountsOrdering();
    }

    return () => {
      if (onUnmount) {
        refreshAccountsOrdering();
      }
    };
  }, [onMount, onUnmount, onUpdate, refreshAccountsOrdering]);
}

export const cleanCache = () => async (dispatch: *) => {
  dispatch({ type: "CLEAN_CACHE" });
  dispatch({ type: "LEDGER_CV:WIPE" });
  await clearBridgeCache();
  await clearLibcore();
  flushAll();
};
