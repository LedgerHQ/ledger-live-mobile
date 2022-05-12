import React, { useCallback, useMemo } from "react";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { isAccountEmpty } from "@ledgerhq/live-common/lib/account";

import { Flex } from "@ledgerhq/native-ui";
import { NavigatorName, ScreenName } from "../../const";
import {
  accountsCountSelector,
  hasLendEnabledAccountsSelector,
  accountsSelector,
} from "../../reducers/accounts";
import BottomModal, { Props as ModalProps } from "../BottomModal";
import BottomModalChoice from "../BottomModalChoice";
import { readOnlyModeEnabledSelector } from "../../reducers/settings";

export default function CreateModal({ isOpened, onClose }: ModalProps) {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const readOnlyModeEnabled = useSelector(readOnlyModeEnabledSelector);
  const accountsCount = useSelector(accountsCountSelector);
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
  const onExchange = useCallback(() => onNavigate(ScreenName.Exchange), [
    onNavigate,
  ]);
  const onLending = useCallback(
    () =>
      onNavigate(NavigatorName.Lending, {
        screen: ScreenName.LendingDashboard,
      }),
    [onNavigate],
  );

  return (
    <Flex
      flexDirection="column"
      alignItems="flex-start"
      p="24px"
      pt="40px"
      // backgroundColor="lightgreen"
    >
      <BottomModalChoice
        event="TransferSend"
        title={t("transfer.send.title")}
        onPress={
          accountsCount > 0 && !readOnlyModeEnabled && !areAccountsEmpty
            ? onSendFunds
            : null
        }
        iconName="ArrowFromBottom"
      />
      <BottomModalChoice
        event="TransferReceive"
        title={t("transfer.receive.title")}
        onPress={accountsCount > 0 ? onReceiveFunds : null}
        iconName="ArrowToBottom"
      />
      <BottomModalChoice
        event="TransferExchange"
        title={t("transfer.exchange.title")}
        iconName="Transfer"
        onPress={onExchange}
      />
      <BottomModalChoice
        event="TransferSwap"
        title={t("transfer.swap.title")}
        iconName="BuyCrypto"
        onPress={accountsCount > 0 && !readOnlyModeEnabled ? onSwap : null}
      />
      {lendingEnabled ? (
        <BottomModalChoice
          event="TransferLending"
          title={t("transfer.lending.titleTransferTab")}
          iconName="Lend"
          onPress={accountsCount > 0 && !readOnlyModeEnabled ? onLending : null}
        />
      ) : null}
    </Flex>
  );
}
