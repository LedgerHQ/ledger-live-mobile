import React, { useState, useCallback } from "react";
import { TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { Text } from "@ledgerhq/native-ui";
import InfoModal from "../../../modals/Info";

type Props = {
  disabled?: boolean;
  onPress: () => void;
};

export default function DelegationLabelRight({ onPress, disabled }: Props) {
  const { t } = useTranslation();

  const [disabledModalOpen, setDisabledModalOpen] = useState(false);

  const onClick = useCallback(() => {
    if (disabled) setDisabledModalOpen(true);
    else onPress();
  }, [onPress, disabled]);

  const onCloseModal = useCallback(() => setDisabledModalOpen(false), []);

  return (
    <TouchableOpacity onPress={onClick}>
      <Text fontWeight="semiBold" color={disabled ? "grey" : "live"}>
        {t("account.delegation.addDelegation")}
      </Text>
      <InfoModal
        isOpened={!!disabledModalOpen}
        onClose={onCloseModal}
        data={[
          {
            title: t("cosmos.info.delegationUnavailable.title"),
            description: t("cosmos.info.delegationUnavailable.description"),
          },
        ]}
      />
    </TouchableOpacity>
  );
}
