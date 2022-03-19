import React, { useCallback, useMemo } from "react";
import { TouchableOpacity } from "react-native";
import useEnv from "@ledgerhq/live-common/lib/hooks/useEnv";
import {
  getAccountCurrency,
  getAccountName,
  getAccountUnit,
} from "@ledgerhq/live-common/lib/account";
import { getCurrencyColor } from "@ledgerhq/live-common/lib/currencies";
import {
  Account,
  Currency,
  TokenAccount,
} from "@ledgerhq/live-common/lib/types";
import { Flex, ProgressLoader, Text } from "@ledgerhq/native-ui";
import { useTheme } from "styled-components/native";
import { useSelector } from "react-redux";
import { useCalculate } from "@ledgerhq/live-common/lib/countervalues/react";
import { BigNumber } from "bignumber.js";
import { ScreenName } from "../../const";
import CurrencyUnitValue from "../../components/CurrencyUnitValue";
import CounterValue from "../../components/CounterValue";
import CurrencyIcon from "../../components/CurrencyIcon";
import { ensureContrast } from "../../colors";
import Delta from "../../components/Delta";
import { useBalanceHistoryWithCountervalue } from "../../actions/portfolio";
import { counterValueCurrencySelector } from "../../reducers/settings";

type Props = {
  account: Account | TokenAccount;
  accountId: string;
  navigation: any;
  isLast: boolean;
  onSetAccount: (arg: TokenAccount) => void;
  portfolioValue: number;
};

const AccountRow = ({
  navigation,
  account,
  accountId,
  portfolioValue,
}: Props) => {
  // makes it refresh if this changes
  useEnv("HIDE_EMPTY_TOKEN_ACCOUNTS");
  const { colors } = useTheme();

  const currency = getAccountCurrency(account);
  const name = getAccountName(account);
  const unit = getAccountUnit(account);

  const color = useMemo(
    () => ensureContrast(getCurrencyColor(currency), colors.constant.white),
    [colors, currency],
  );

  const counterValueCurrency: Currency = useSelector(
    counterValueCurrencySelector,
  );

  const countervalue = useCalculate({
    from: currency,
    to: counterValueCurrency,
    value:
      account.balance instanceof BigNumber
        ? account.balance.toNumber()
        : account.balance,
    disableRounding: true,
  });

  const portfolioPercentage = useMemo(
    () => (countervalue ? countervalue / Math.max(1, portfolioValue) : 0), // never divide by potential zero, we dont want to go towards infinity
    [countervalue, portfolioValue],
  );

  const { countervalueChange } = useBalanceHistoryWithCountervalue({
    account,
    range: "day",
  });

  const onAccountPress = useCallback(() => {
    if (account.type === "Account") {
      navigation.navigate(ScreenName.Account, {
        accountId,
        isForwardedFromAccounts: true,
      });
    } else if (account.type === "TokenAccount") {
      navigation.navigate(ScreenName.Account, {
        parentId: account?.parentId,
        accountId: account.id,
      });
    }
  }, [account, accountId, navigation]);

  return (
    <TouchableOpacity onPress={onAccountPress}>
      <Flex flexDirection="row" py={5}>
        <Flex mr={6}>
          <ProgressLoader
            strokeWidth={2}
            mainColor={color}
            secondaryColor={colors.neutral.c40}
            progress={portfolioPercentage}
            radius={22}
          >
            <Flex
              bg={color}
              width={"32px"}
              height={"32px"}
              alignItems={"center"}
              justifyContent={"center"}
              borderRadius={32}
            >
              <CurrencyIcon
                currency={currency}
                size={20}
                color={colors.constant.white}
              />
            </Flex>
          </ProgressLoader>
        </Flex>
        <Flex flex={1}>
          <Flex flexDirection="row" justifyContent="space-between">
            <Flex alignItems="flex-start" flex={1}>
              <Text
                variant="large"
                fontWeight="semiBold"
                color="neutral.c100"
                numberOfLines={1}
              >
                {name}
              </Text>
            </Flex>
            <Flex alignItems="flex-end" flexShrink={0} pl={3}>
              <Text variant="large" fontWeight="semiBold" color="neutral.c100">
                <CounterValue
                  currency={currency}
                  value={account.balance}
                  joinFragmentsSeparator=""
                />
              </Text>
            </Flex>
          </Flex>
          <Flex flexDirection="row" justifyContent="space-between">
            <Text variant="body" fontWeight="medium" color="neutral.c70">
              <CurrencyUnitValue showCode unit={unit} value={account.balance} />
            </Text>
            <Delta percent valueChange={countervalueChange} />
          </Flex>
        </Flex>
      </Flex>
    </TouchableOpacity>
  );
};

export default React.memo<Props>(AccountRow);
