import React, { useCallback } from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useGlobalSyncState } from "@ledgerhq/live-common/lib/bridge/react";
import { useAnnouncements } from "@ledgerhq/live-common/lib/notifications/AnnouncementProvider";
import { useFilteredServiceStatus } from "@ledgerhq/live-common/lib/notifications/ServiceStatusProvider";
import { Box, Flex, Text } from "@ledgerhq/native-ui";
import {
  NotificationsMedium,
  NotificationsOnMedium,
  SettingsMedium,
  NanoFoldedMedium,
  WarningMedium,
} from "@ledgerhq/native-ui/assets/icons";
import { useTheme } from "styled-components/native";
import { isUpToDateSelector } from "../../reducers/accounts";
import { networkErrorSelector } from "../../reducers/appstate";
import HeaderErrorTitle from "../../components/HeaderErrorTitle";
import HeaderSynchronizing from "../../components/HeaderSynchronizing";
import Touchable from "../../components/Touchable";
import BellIcon from "../../icons/Bell";
import SettingsIcon from "../../icons/Settings";
import { NavigatorName, ScreenName } from "../../const";
import { scrollToTop } from "../../navigation/utils";
import LText from "../../components/LText";
import Warning from "../../icons/WarningOutline";
import LiveLogo from "../../icons/LiveLogo";
import LiveLogoIcon from "../../icons/LiveLogoIcon";

type HeaderInformationProps = { isLoading: boolean; error?: Error | null };
const HeaderInformation = ({ isLoading, error }: HeaderInformationProps) => {
  const { colors } = useTheme();

  if (error)
    return <HeaderErrorTitle withDescription withDetail error={error} />;

  if (isLoading) return <HeaderSynchronizing />;

  return <LiveLogo size={32} color={colors.neutral.c100} />;
};

export default function PortfolioHeader() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const { allIds, seenIds } = useAnnouncements();
  const { incidents } = useFilteredServiceStatus();

  const onNotificationButtonPress = useCallback(() => {
    navigation.navigate(NavigatorName.NotificationCenter);
  }, [navigation]);

  const onStatusErrorButtonPress = useCallback(() => {
    navigation.navigate(NavigatorName.NotificationCenter, {
      screen: ScreenName.NotificationCenterStatus,
    });
  }, [navigation]);

  const onSettingsButtonPress = useCallback(() => {
    navigation.navigate(NavigatorName.Settings);
  }, [navigation]);

  const isUpToDate = useSelector(isUpToDateSelector);
  const networkError = useSelector(networkErrorSelector);
  const { pending, error } = useGlobalSyncState();

  const notificationsCount = allIds.length - seenIds.length;

  return (
    <Flex flexDirection={"row"} alignItems={"center"} px={6}>
      <TouchableWithoutFeedback onPress={scrollToTop}>
        <View style={styles.content}>
          <HeaderInformation
            isLoading={pending && !isUpToDate}
            error={networkError || error}
          />
        </View>
      </TouchableWithoutFeedback>
      <Box mr={7}>
        <Touchable>
          <NanoFoldedMedium size={24} color={"neutral.c100"} />
        </Touchable>
      </Box>
      <Box mr={7}>
        <Touchable onPress={onNotificationButtonPress}>
          {notificationsCount > 0 ? (
            <NotificationsOnMedium size={24} color={"neutral.c100"} />
          ) : (
            <NotificationsMedium size={24} color={"neutral.c100"} />
          )}
        </Touchable>
      </Box>
      {incidents.length > 0 && (
        <Box mr={7}>
          <Touchable onPress={onStatusErrorButtonPress}>
            <WarningMedium size={24} color={"warning.c100"} />
          </Touchable>
        </Box>
      )}
      <Box>
        <Touchable onPress={onSettingsButtonPress}>
          <SettingsMedium size={24} color={"neutral.c100"} />
        </Touchable>
      </Box>
    </Flex>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 16,
  },
  content: {
    flexGrow: 1,
    flexShrink: 1,
  },
  distributionButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: 32,
    alignSelf: "center",
  },
  marginLeft: { marginLeft: 8 },
  badge: {
    width: 16,
    height: 16,
    borderRadius: 15,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    top: -8,
    right: -8,
    zIndex: 2,
  },
  badgeLabel: { fontSize: 8, color: "#FFF" },
});
