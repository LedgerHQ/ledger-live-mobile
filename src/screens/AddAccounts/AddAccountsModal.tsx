import React, { useCallback } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { BottomDrawer, Box, Flex, Text } from "@ledgerhq/native-ui";
import { NavigatorName } from "../../const";
import { readOnlyModeEnabledSelector } from "../../reducers/settings";
import Illustration from "../../images/illustration/Illustration";
import NanoXFolded from "../../images/devices/NanoXFolded";

const images = {
  light: {
    withYourLedger: require("../../images/illustration/Light/_067.png"),
    importFromYourDesktop: require("../../images/illustration/Light/_074.png"),
  },
  dark: {
    withYourLedger: require("../../images/illustration/Dark/_067.png"),
    importFromYourDesktop: require("../../images/illustration/Dark/_074.png"),
  },
};

type Props = {
  navigation: any;
  isOpened: boolean;
  onClose: () => void;
};

const Card = ({
  title,
  subtitle,
  onPress,
  Image,
}: {
  title: string;
  subtitle: string;
  Image: React.ReactNode;
  onPress: TouchableOpacityProps["onPress"];
}) => (
  <TouchableOpacity onPress={onPress}>
    <Flex
      flexDirection={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      borderWidth={"1px"}
      borderColor={"neutral.c40"}
      borderRadius={2}
      mb={9}
    >
      <Box py={7} pl={7} flexShrink={1}>
        <Text variant={"large"} fontWeight={"semiBold"} color={"neutral.c100"}>
          {title}
        </Text>
        <Text
          variant={"body"}
          fontWeight={"medium"}
          color={"neutral.c70"}
          mt={2}
        >
          {subtitle}
        </Text>
      </Box>
      <Box py={3} pl={3} pr={6}>
        {Image}
      </Box>
    </Flex>
  </TouchableOpacity>
);

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
      {!readOnlyModeEnabled && (
        <Card
          title={t("v3.addAccountsModal.add.title")}
          subtitle={t("v3.addAccountsModal.add.description")}
          Image={<NanoXFolded size={96} />}
          onPress={onClickAdd}
        />
      )}

      <Card
        title={t("v3.addAccountsModal.import.title")}
        subtitle={t("v3.addAccountsModal.import.description")}
        Image={
          <Illustration
            lightSource={images.light.withYourLedger}
            darkSource={images.dark.withYourLedger}
            size={96}
          />
        }
        onPress={onClickImport}
      />
    </BottomDrawer>
  );
}
