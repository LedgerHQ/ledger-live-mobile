import React, { useCallback } from "react";
import { ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ModalHeader } from "@ledgerhq/native-ui/components/Layout/Modals/BaseModal";
import { PlusMedium, DevicesAltMedium } from "@ledgerhq/native-ui/assets/icons";
import { BottomDrawer, Box, Button } from "@ledgerhq/native-ui";
import { NavigatorName } from "../../const";
import { readOnlyModeEnabledSelector } from "../../reducers/settings";

type Props = {
  navigation: any;
  isOpened: boolean;
  onClose: () => void;
};

export default function AddAccountsModal({
  navigation,
  onClose,
  isOpened,
}: Props) {
  const { t } = useTranslation();
  const readOnlyModeEnabled = useSelector(readOnlyModeEnabledSelector);

  const onClickAdd = useCallback(() => {
    navigation.navigate(NavigatorName.AddAccounts);
    onClose();
  }, [navigation, onClose]);

  const onClickImport = useCallback(() => {
    navigation.navigate(NavigatorName.ImportAccounts);
    onClose();
  }, [navigation, onClose]);

  return (
    <BottomDrawer
      id="AddAccountsModal"
      isOpen={isOpened}
      onClose={onClose}
      title={t("v3.portfolio.emptyState.addAccounts.title")}
    >
      <ScrollView>
        {!readOnlyModeEnabled && (
          <Box bg={"neutral.c30"} p={8} borderRadius={2} mb={9}>
            <ModalHeader
              title={t("addAccountsModal.ctaAdd")}
              Icon={PlusMedium}
              iconColor={"neutral.c100"}
            />
            <Button
              event="AddAccountWithDevice"
              onPress={onClickAdd}
              type={"color"}
            >
              {t("addAccountsModal.ctaAdd")}
            </Button>
          </Box>
        )}

        <Box bg={"neutral.c30"} p={8} borderRadius={2} mb={9}>
          <ModalHeader
            title={t("addAccountsModal.ctaImport")}
            Icon={DevicesAltMedium}
            iconColor={"neutral.c100"}
          />

          <Button
            event="AddAccountWithQR"
            type={"color"}
            onPress={onClickImport}
          >
            {t("addAccountsModal.ctaImport")}
          </Button>
        </Box>
      </ScrollView>
    </BottomDrawer>
  );
}
