// @flow
import React, { useCallback } from "react";
import {
  Linking,
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Trans } from "react-i18next";

import { useLedgerStatus } from "@ledgerhq/live-common/lib/announcements/status/react";
import CheckCircle from "../../icons/CheckCircle";
import Warning from "../../icons/WarningOutline";
import LText from "../../components/LText";
import NewsRow from "./NewsRow";
import { urls } from "../../config/urls";

export default function NotificationCenter() {
  const { incidents } = useLedgerStatus();
  const { colors } = useTheme();

  const onHelpPageRedirect = useCallback(() => {
    Linking.openURL(urls.ledgerStatus); // @TODO redirect to correct url
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      {incidents.length > 0 ? (
        <View style={styles.incidentContainer}>
          <Warning size={42} color={colors.orange} />
          <LText bold style={styles.title}>
            <Trans i18nKey="notificationCenter.status.error.title" />
          </LText>
        </View>
      ) : null}
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={incidents}
        renderItem={props => (
          <NewsRow
            {...props}
            style={[styles.border, { borderColor: colors.lightFog }]}
          />
        )}
        keyExtractor={(item, index) => item.uuid + index}
        ItemSeparatorComponent={() => (
          <View
            style={[styles.separator, { backgroundColor: colors.lightFog }]}
          />
        )}
        ListEmptyComponent={
          <View style={styles.container}>
            <CheckCircle size={42} color={colors.success} />
            <LText bold style={styles.title}>
              <Trans i18nKey="notificationCenter.status.ok.title" />
            </LText>
            <LText bold style={[styles.desc]}>
              <Trans i18nKey="notificationCenter.status.ok.desc">
                <LText color="grey" />
                <LText semiBold color="live" onPress={onHelpPageRedirect} />
              </Trans>
            </LText>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 16 },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  incidentContainer: {
    flex: 0.5,
    justifyContent: "flex-end",
    paddingBottom: 50,
    alignItems: "center",
  },
  border: { borderWidth: 1 },
  listContainer: { flex: 1, paddingHorizontal: 16 },
  title: { fontSize: 18, marginTop: 23, marginBottom: 8 },
  desc: { fontSize: 13 },
  separator: {
    width: "100%",
    height: 1,
    marginBottom: 8,
  },
});
