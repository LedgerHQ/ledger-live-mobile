// @flow
import React, { useCallback } from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useGlobalSyncState } from "@ledgerhq/live-common/lib/bridge/react";
import { useAnnouncements } from "@ledgerhq/live-common/lib/notifications/AnnouncementProvider";
import { useServiceStatus } from "@ledgerhq/live-common/lib/notifications/ServiceStatusProvider";
import { isUpToDateSelector } from "../../reducers/accounts";
import { networkErrorSelector } from "../../reducers/appstate";
import HeaderErrorTitle from "../../components/HeaderErrorTitle";
import HeaderSynchronizing from "../../components/HeaderSynchronizing";
import Touchable from "../../components/Touchable";
import Greetings from "./Greetings";
import IconPie from "../../icons/Pie";
import BellIcon from "../../icons/Bell";
import { NavigatorName, ScreenName } from "../../const";
import { scrollToTop } from "../../navigation/utils";

type Props = {
  showDistribution?: boolean,
  nbAccounts: number,
  showGreeting: boolean,
};

export default function PortfolioHeader({
  nbAccounts,
  showGreeting,
  showDistribution,
}: Props) {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const { allIds, seenIds } = useAnnouncements();
  const { incidents } = useServiceStatus();

  const onDistributionButtonPress = useCallback(() => {
    navigation.navigate(ScreenName.Distribution);
  }, [navigation]);

  const onNotificationButtonPress = useCallback(() => {
    navigation.navigate(NavigatorName.NotificationCenter);
  }, [navigation]);

  const isUpToDate = useSelector(isUpToDateSelector);
  const networkError = useSelector(networkErrorSelector);
  const { pending, error } = useGlobalSyncState();

  const hasNotifications =
    seenIds.length < allIds.length || incidents.length > 0;

  const content =
    pending && !isUpToDate ? (
      <HeaderSynchronizing />
    ) : error ? (
      <HeaderErrorTitle
        withDescription
        withDetail
        error={networkError || error}
      />
    ) : showGreeting ? (
      <Greetings nbAccounts={nbAccounts} />
    ) : null;

  if (!content) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <TouchableWithoutFeedback onPress={scrollToTop}>
        <View style={styles.content}>{content}</View>
      </TouchableWithoutFeedback>
      {showDistribution && (
        <View style={[styles.distributionButton]}>
          <Touchable
            event="DistributionCTA"
            onPress={onDistributionButtonPress}
          >
            <IconPie size={18} color={colors.grey} />
          </Touchable>
        </View>
      )}
      <View style={[styles.distributionButton, styles.marginLeft]}>
        <Touchable event="" onPress={onNotificationButtonPress}>
          {/** @TODO set correct analytics event here */}
          {hasNotifications && (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: colors.alert,
                  borderColor: colors.background,
                },
              ]}
            />
          )}
          <BellIcon size={18} color={colors.grey} />
        </Touchable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
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
    width: 15,
    height: 15,
    borderWidth: 3,
    borderRadius: 15,
    position: "absolute",
    top: -6,
    right: -4,
    zIndex: 2,
  },
});
