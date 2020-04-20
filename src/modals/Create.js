/* @flow */

import React, { useCallback } from "react";
import SafeAreaView from "react-native-safe-area-view";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { NavigatorName, ScreenName } from "../const";
import { accountsCountSelector } from "../reducers/accounts";
import IconSend from "../icons/Send";
import IconReceive from "../icons/Receive";
import IconExchange from "../icons/Exchange";
import BottomModal from "../components/BottomModal";
import BottomModalChoice from "../components/BottomModalChoice";
import type { Props as ModalProps } from "../components/BottomModal";
import { readOnlyModeEnabledSelector } from "../reducers/settings";

const forceInset = { bottom: "always" };

export default function CreateModal({ isOpened, onClose }: ModalProps) {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();

  const readOnlyModeEnabled = useSelector(readOnlyModeEnabledSelector);
  const accountsCount = useSelector(accountsCountSelector);

  const onNavigate = useCallback(
    (routeName: string) => {
      navigation.navigate({
        routeName,
        params: {
          goBackKey: route.key,
        },
      });

      if (onClose) {
        onClose();
      }
    },
    [navigation, route.key, onClose],
  );

  const onSendFunds = useCallback(() => onNavigate(NavigatorName.SendFunds), [
    onNavigate,
  ]);
  const onReceiveFunds = useCallback(
    () => onNavigate(NavigatorName.ReceiveFunds),
    [onNavigate],
  );
  const onExchange = useCallback(() => onNavigate(ScreenName.Transfer), [
    onNavigate,
  ]);

  return (
    <BottomModal id="CreateModal" isOpened={isOpened} onClose={onClose}>
      <SafeAreaView forceInset={forceInset}>
        <BottomModalChoice
          event="TransferSend"
          title={t("transfer.send.title")}
          onPress={
            accountsCount > 0 && !readOnlyModeEnabled ? onSendFunds : null
          }
          Icon={IconSend}
        />
        <BottomModalChoice
          event="TransferReceive"
          title={t("transfer.receive.title")}
          onPress={accountsCount > 0 ? onReceiveFunds : null}
          Icon={IconReceive}
        />
        <BottomModalChoice
          event="TransferExchange"
          title={t("transfer.exchange.title")}
          Icon={IconExchange}
          onPress={onExchange}
        />
      </SafeAreaView>
    </BottomModal>
  );
}
