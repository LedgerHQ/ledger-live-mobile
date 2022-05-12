import React, { useCallback, useMemo } from "react";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { isAccountEmpty } from "@ledgerhq/live-common/lib/account";

import { Flex, Icons, Text } from "@ledgerhq/native-ui";
import { NavigatorName, ScreenName } from "../../const";
import {
  accountsCountSelector,
  hasLendEnabledAccountsSelector,
  accountsSelector,
} from "../../reducers/accounts";
import { Props as ModalProps } from "../BottomModal";
import { readOnlyModeEnabledSelector } from "../../reducers/settings";
import TransferButton from "./TransferButton";
import BuyDeviceBanner, { IMAGE_PROPS_SMALL_NANO } from "../BuyDeviceBanner";
import { ScrollView } from "react-native";

export default function TransferDrawer({ onClose }: ModalProps) {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const readOnlyModeEnabled = useSelector(readOnlyModeEnabledSelector);
  const accountsCount: number = useSelector(accountsCountSelector);
  const lendingEnabled = useSelector(hasLendEnabledAccountsSelector);
  const accounts = useSelector(accountsSelector);
  const areAccountsEmpty = useMemo(() => accounts.every(isAccountEmpty), [
    accounts,
  ]);

  const onNavigate = useCallback(
    (name: string, options?: { [key: string]: any }) => {
      navigation.navigate(name, options);

      if (onClose) {
        onClose();
      }
    },
    [navigation, onClose],
  );

  const onSendFunds = useCallback(
    () =>
      onNavigate(NavigatorName.SendFunds, {
        screen: ScreenName.SendCoin,
      }),
    [onNavigate],
  );
  const onReceiveFunds = useCallback(
    () =>
      onNavigate(NavigatorName.ReceiveFunds, {
        screen: ScreenName.ReceiveSelectAccount,
      }),
    [onNavigate],
  );
  const onSwap = useCallback(
    () =>
      onNavigate(NavigatorName.Swap, {
        screen: ScreenName.Swap,
      }),
    [onNavigate],
  );
  const onBuy = useCallback(
    () =>
      onNavigate(NavigatorName.Exchange, { screen: ScreenName.ExchangeBuy }),
    [onNavigate],
  );
  const onSell = useCallback(
    () =>
      onNavigate(NavigatorName.Exchange, { screen: ScreenName.ExchangeSell }),
    [onNavigate],
  );
  const onLending = useCallback(
    () =>
      onNavigate(NavigatorName.Lending, {
        screen: ScreenName.LendingDashboard,
      }),
    [onNavigate],
  );

  const buttons = useMemo(
    () =>
      [
        {
          event: "TransferSend",
          title: t("transfer.send.title"),
          description: t("transfer.send.description"),
          onPress:
            accountsCount > 0 && !readOnlyModeEnabled && !areAccountsEmpty
              ? onSendFunds
              : null,
          Icon: Icons.ArrowTopMedium,
        },
        {
          event: "TransferReceive",
          title: t("transfer.receive.title"),
          description: t("transfer.receive.description"),
          onPress: accountsCount > 0 ? onReceiveFunds : null,
          Icon: Icons.ArrowBottomMedium,
        },
        {
          event: "TransferBuy",
          title: t("transfer.buy.title"),
          description: t("transfer.buy.description"),
          Icon: Icons.PlusMedium,
          onPress: onBuy,
        },
        {
          event: "TransferSell",
          title: t("transfer.sell.title"),
          description: t("transfer.sell.description"),
          Icon: Icons.MinusMedium,
          onPress: onSell,
        },
        {
          event: "TransferSwap",
          title: t("transfer.swap.title"),
          description: t("transfer.swap.description"),
          Icon: Icons.BuyCryptoMedium,
          onPress: accountsCount > 0 && !readOnlyModeEnabled ? onSwap : null,
        },
        ...(lendingEnabled
          ? [
              {
                event: "TransferLending",
                title: t("transfer.lending.titleTransferTab"),
                description: t("transfer.lending.descriptionTransferTab"),
                tag: t("common.popular"),
                Icon: Icons.LendMedium,
                onPress:
                  accountsCount > 0 && !readOnlyModeEnabled ? onLending : null,
              },
            ]
          : []),
      ].map((props, index, arr) => (
        <TransferButton
          {...props}
          disabled={readOnlyModeEnabled}
          style={{ marginBottom: index < arr.length - 1 ? 32 : 0 }}
        />
      )),
    [
      accountsCount,
      areAccountsEmpty,
      lendingEnabled,
      onBuy,
      onSell,
      onLending,
      onReceiveFunds,
      onSendFunds,
      onSwap,
      readOnlyModeEnabled,
      t,
    ],
  );

  return (
    <Flex flexDirection="column" alignItems="flex-start" p="24px" pt="40px" flex={1}>
      <ScrollView style={{opacity: readOnlyModeEnabled ? 0.3 : 1}}>
        {buttons}
      </ScrollView>
      {readOnlyModeEnabled && <BuyDeviceBanner
        topLeft={(
          <Text color="#6358B7" uppercase mb="8px" fontSize="11px" fontWeight="semiBold">
            {t("buyDevice.bannerTitle2")}
          </Text>
        )}
        style={{marginTop: 36, paddingTop: 13.5, paddingBottom: 13.5}}
        buttonLabel={t("buyDevice.bannerButtonTitle2")}
        buttonSize="small"
        {...IMAGE_PROPS_SMALL_NANO}
      />}
    </Flex>
  );
}
