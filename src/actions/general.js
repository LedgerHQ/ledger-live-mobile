// @flow
import { useMemo, useCallback, useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { isAccountDelegating } from "@ledgerhq/live-common/lib/families/tezos/bakers";
import {
  nestedSortAccounts,
  flattenSortAccounts,
  sortAccountsComparatorFromOrder,
} from "@ledgerhq/live-common/lib/account";
import {
  useDistribution as useDistributionCommon,
  useCalculateCountervalueCallback as useCalculateCountervalueCallbackCommon,
  useCountervaluesPolling,
} from "@ledgerhq/live-common/lib/countervalues/react";
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
  const to = useSelector(counterValueCurrencySelector);
  return useDistributionCommon({ accounts, to });
}

export function useCalculateCountervalueCallback() {
  const to = useSelector(counterValueCurrencySelector);
  return useCalculateCountervalueCallbackCommon({ to });
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

export function useCleanCache() {
  const dispatch = useDispatch();
  const { wipe } = useCountervaluesPolling();

  return useCallback(async () => {
    dispatch({ type: "CLEAN_CACHE" });
    dispatch({ type: "LEDGER_CV:WIPE" });
    await clearBridgeCache();
    await clearLibcore();
    wipe();
    flushAll();
  }, [dispatch, wipe]);
}
