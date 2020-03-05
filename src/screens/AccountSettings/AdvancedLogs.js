/* @flow */
import React from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { accountAndParentScreenSelectorCreator } from "../../reducers/accounts";
import LText from "../../components/LText";
import { localeIds } from "../../languages";
import colors from "../../colors";

interface RouteParams {
  accountId: string;
}

interface Props {
  navigation: *;
  route: { params: RouteParams };
}

export default function AdvancedLogs({ route }: Props) {
  const { account } = useSelector(accountAndParentScreenSelectorCreator(route));
  const { t } = useTranslation();

  const usefulData = {
    xpub: account.xpub || undefined,
    index: account.index,
    freshAddressPath: account.freshAddressPath,
    id: account.id,
    blockHeight: account.blockHeight,
  };

  const readableDate = account.lastSyncDate.toLocaleDateString(localeIds, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <View style={styles.body}>
        <LText semiBold style={styles.sync}>
          {t("common.sync.ago", { time: readableDate })}
        </LText>
        <LText selectable monospace style={styles.mono}>
          {JSON.stringify(usefulData, null, 2)}
        </LText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 16,
    paddingBottom: 64,
  },
  body: {
    flexDirection: "column",
    flex: 1,
  },
  sync: {
    marginBottom: 16,
  },

  mono: {
    fontSize: 14,
    color: colors.darkBlue,
  },
});
