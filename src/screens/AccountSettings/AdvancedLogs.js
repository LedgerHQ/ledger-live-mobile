/* @flow */
import invariant from "invariant";
import React from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { accountScreenSelector } from "../../reducers/accounts";
import LText from "../../components/LText";
import NavigationScrollView from "../../components/NavigationScrollView";
import { localeIds } from "../../languages";

type Props = {
  navigation: any,
  route: { params: RouteParams },
};

type RouteParams = {
  accountId: string,
};

export default function AdvancedLogs({ route }: Props) {
  const { account } = useSelector(accountScreenSelector(route));
  const { t } = useTranslation();

  const usefulData = {
    xpub: account?.xpub || undefined,
    index: account?.index || undefined,
    freshAddressPath: account?.freshAddressPath || undefined,
    id: account?.id || undefined,
    blockHeight: account?.blockHeight || undefined,
  };

  invariant(account?.type === "Account", "account must be a main account");

  const readableDate = account.lastSyncDate.toLocaleDateString(localeIds, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <NavigationScrollView contentContainerStyle={styles.root}>
      <View style={styles.body}>
        <LText semiBold style={styles.sync}>
          {t("common.sync.ago", { time: readableDate })}
        </LText>
        <LText selectable monospace style={styles.mono}>
          {JSON.stringify(usefulData, null, 2)}
        </LText>
      </View>
    </NavigationScrollView>
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
  },
});
