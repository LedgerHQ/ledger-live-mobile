// @flow
import React, { useCallback } from "react";
import {
  SafeAreaView,
  StyleSheet,
  SectionList,
  RefreshControl,
  View,
} from "react-native";
import { useAnnouncements } from "@ledgerhq/live-common/lib/notifications/AnnouncementProvider";
import { groupAnnouncements } from "@ledgerhq/live-common/lib/notifications/AnnouncementProvider/helpers";
import { useTheme } from "@react-navigation/native";

import { Trans } from "react-i18next";
import NewsRow from "./NewsRow";
import LText from "../../components/LText";
import FormatDate from "../../components/FormatDate";

const viewabilityConfig = {
  viewAreaCoveragePercentThreshold: 95,
};

export default function NotificationCenter() {
  const { colors, dark } = useTheme();
  const { cache, setAsSeen, updateCache, allIds } = useAnnouncements();

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }) => {
      viewableItems
        .filter(({ item }) => item && item.uuid)
        .map(({ item }) => item.uuid)
        .forEach(setAsSeen);
    },
    [setAsSeen],
  );

  const sections = groupAnnouncements(allIds.map(uuid => cache[uuid])).map(
    d => ({
      ...d,
      title: d.day,
    }),
  );

  return (
    <SafeAreaView style={styles.root}>
      <SectionList
        style={styles.sectionList}
        contentContainerStyle={styles.spacer}
        sections={sections}
        renderItem={props => <NewsRow {...props} />}
        renderSectionHeader={({ section: { title } }) =>
          title && title instanceof Date ? (
            <LText
              style={[styles.label, { backgroundColor: colors.lightFog }]}
              semiBold
              color="grey"
            >
              <FormatDate date={title} />
            </LText>
          ) : null
        }
        keyExtractor={(item, index) => item.uuid + index}
        ItemSeparatorComponent={() => (
          <View
            style={[styles.separator, { backgroundColor: colors.lightFog }]}
          />
        )}
        refreshControl={
          <RefreshControl
            progressBackgroundColor={dark ? colors.background : colors.card}
            colors={[colors.live]}
            tintColor={colors.live}
            refreshing={false}
            onRefresh={updateCache}
          />
        }
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <LText bold style={styles.title}>
              <Trans i18nKey="notificationCenter.news.emptyState.title" />
            </LText>
            <LText style={styles.text}>
              <Trans i18nKey="notificationCenter.news.emptyState.desc" />
            </LText>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingVertical: 16 },
  sectionList: {
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 11,
    paddingHorizontal: 16,
    lineHeight: 26,
    height: 26,
    borderRadius: 4,
    marginBottom: 16,
  },
  separator: {
    width: "100%",
    height: 1,
    marginBottom: 8,
  },
  spacer: { flex: 1 },
  emptyState: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
  },
  text: {
    fontSize: 14,
    textAlign: "center",
  },
});
