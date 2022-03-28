// @flow
import React, { useMemo } from "react";

import { useTheme } from "@react-navigation/native";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";

import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";

import type { AccountLike, Account } from "@ledgerhq/live-common/lib/types";

import {
  readOnlyModeEnabledSelector,
  swapSelectableCurrenciesSelector,
} from "../reducers/settings";
import { accountsCountSelector } from "../reducers/accounts";
import { NavigatorName, ScreenName } from "../const";
import FabAccountButtonBar from "./FabAccountButtonBar";
import Minus from "../icons/Minus";
import Swap from "../icons/Swap";
import useActions from "../screens/Account/hooks/useActions";
import useLendingActions from "../screens/Account/hooks/useLendingActions";
import { getAllSupportedCryptoCurrencyIds } from "@ledgerhq/live-common/lib/platform/providers/RampCatalogProvider/helpers";
import { useRampCatalog } from "@ledgerhq/live-common/lib/platform/providers/RampCatalogProvider";
import Plus from "../icons/Plus";

type Props = {
  account?: AccountLike,
  parentAccount?: Account,
};

type FabAccountActionsProps = {
  account: AccountLike,
  parentAccount?: Account,
};

function FabAccountActions({ account, parentAccount }: FabAccountActionsProps) {
  const { colors } = useTheme();

  const currency = getAccountCurrency(account);
  const swapSelectableCurrencies = useSelector(
    swapSelectableCurrenciesSelector,
  );
  const availableOnSwap =
    swapSelectableCurrencies.includes(currency.id) && account.balance.gt(0);
  const readOnlyModeEnabled = useSelector(readOnlyModeEnabledSelector);

  const rampCatalog = useRampCatalog();

  const [canBeBought, canBeSold] = useMemo(() => {
    if (!rampCatalog.value) {
      return [false, false];
    }

    const allBuyableCryptoCurrencyIds = getAllSupportedCryptoCurrencyIds(
      rampCatalog.value.onRamp,
    );
    const allSellableCryptoCurrencyIds = getAllSupportedCryptoCurrencyIds(
      rampCatalog.value.offRamp,
    );

    return [
      allBuyableCryptoCurrencyIds.includes(currency.id),
      allSellableCryptoCurrencyIds.includes(currency.id),
    ];
  }, [rampCatalog.value, currency.id]);

  const allActions = [
    ...(!readOnlyModeEnabled && canBeBought
      ? [
          {
            navigationParams: [
              NavigatorName.ExchangeBuyFlow,
              {
                screen: ScreenName.ExchangeBuy,
                params: {
                  selectedCurrencyId: account && account.currency.id,
                  accountId: account && account.id,
                },
              },
            ],
            label: <Trans i18nKey="account.buy" />,
            Icon: Plus,
            event: "Buy Crypto Account Button",
            eventProperties: {
              currencyName: currency.name,
            },
          },
        ]
      : []),
    ...(!readOnlyModeEnabled && canBeSold
      ? [
          {
            navigationParams: [
              NavigatorName.ExchangeBuyFlow,
              {
                screen: ScreenName.ExchangeSell,
                params: {
                  selectedCurrencyId: account && account.currency.id,
                  accountId: account && account.id,
                },
              },
            ],
            label: <Trans i18nKey="account.sell" />,
            Icon: Minus,
            event: "Sell Crypto Account Button",
            eventProperties: {
              currencyName: currency.name,
            },
          },
        ]
      : []),
    ...(availableOnSwap
      ? [
          {
            navigationParams: [
              NavigatorName.Swap,
              {
                screen: ScreenName.Swap,
                params: {
                  defaultAccount: account,
                  defaultParentAccount: parentAccount,
                },
              },
            ],
            label: (
              <Trans
                i18nKey="transfer.swap.main.header"
                values={{ currency: currency.name }}
              />
            ),
            Icon: Swap,
            event: "Swap Crypto Account Button",
            eventProperties: { currencyName: currency.name },
          },
        ]
      : []),
    ...useActions({ account, parentAccount, colors }),
  ].filter(n => n);

  // Do not display separators as buttons. (they do not have a label)
  //
  // First, count the index at which there are 2 valid buttons.
  let counter = 0;
  const sliceIndex =
    allActions.findIndex(action => {
      if (action.label) counter++;
      return counter === 2;
    }) + 1;

  // Then slice from 0 to the index and ignore invalid button elements.
  // Chaining methods should not be a big deal given the size of the actions array.
  const buttons = allActions
    .slice(0, sliceIndex || undefined)
    .filter(action => !!action.label)
    .slice(0, 2);

  const actions = {
    default: sliceIndex ? allActions.slice(sliceIndex) : [],
    lending: useLendingActions({ account }),
  };

  return (
    <FabAccountButtonBar
      buttons={buttons}
      actions={actions}
      account={account}
      parentAccount={parentAccount}
    />
  );
}

function FabActions({ account, parentAccount }: Props) {
  const readOnlyModeEnabled = useSelector(readOnlyModeEnabledSelector);
  const accountsCount = useSelector(accountsCountSelector);

  if (account)
    return (
      <FabAccountActions account={account} parentAccount={parentAccount} />
    );

  const actions = [
    ...(accountsCount > 0 && !readOnlyModeEnabled
      ? [
          {
            event: "TransferSwap",
            label: <Trans i18nKey="transfer.swap.title" />,
            Icon: Swap,
            navigationParams: [
              NavigatorName.Swap,
              {
                screen: ScreenName.Swap,
              },
            ],
          },
        ]
      : []),
    {
      event: "TransferExchange",
      label: <Trans i18nKey="exchange.buy.tabTitle" />,
      Icon: Plus,
      navigationParams: [
        NavigatorName.Exchange,
        { screen: ScreenName.ExchangeBuy },
      ],
    },
    {
      event: "TransferExchange",
      label: <Trans i18nKey="exchange.sell.tabTitle" />,
      Icon: Minus,
      navigationParams: [
        NavigatorName.Exchange,
        { screen: ScreenName.ExchangeSell },
      ],
    },
  ].filter(n => n);

  return <FabAccountButtonBar buttons={actions} />;
}

export default FabActions;
