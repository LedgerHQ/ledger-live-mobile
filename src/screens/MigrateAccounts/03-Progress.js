// @flow

import { migrateAccounts } from "@ledgerhq/live-common/lib/account";
import { getCurrencyBridge } from "@ledgerhq/live-common/lib/bridge";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import type {
  ScanAccountEvent,
  Account,
} from "@ledgerhq/live-common/lib/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Trans } from "react-i18next";
import { StyleSheet, View } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import type { NavigationScreenProp } from "react-navigation";
import { withNavigation } from "@react-navigation/compat";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { reduce } from "rxjs/operators";
import { setAccounts } from "../../actions/accounts";
import colors, { rgba } from "../../colors";
import { ScreenName } from "../../const";
import Button from "../../components/Button";
import LText from "../../components/LText";
import RoundedCurrencyIcon from "../../components/RoundedCurrencyIcon";
import TranslatedError from "../../components/TranslatedError";
import logger from "../../logger";
import extraStatusBarPadding from "../../logic/extraStatusBarPadding";
import {
  accountsSelector,
  migratableAccountsSelector,
} from "../../reducers/accounts";

const mapStateToProps = createStructuredSelector({
  accounts: accountsSelector,
  migratableAccounts: migratableAccountsSelector,
  currencyIds: state =>
    migratableAccountsSelector(state)
      .reduce(
        (c, a) => (c.includes(a.currency.id) ? c : [...c, a.currency.id]),
        [],
      )
      .sort(),
});

const mapDispatchToProps = {
  setAccounts,
};

const forceInset = { bottom: "always" };

type Props = {
  navigation: NavigationScreenProp<*>,
  accounts: Account[],
  setAccounts: (Account[]) => void,
  currencyIds: string[],
  migratableAccounts: Account[],
};

const Progress = ({
  navigation,
  accounts,
  setAccounts,
  currencyIds,
  migratableAccounts,
}: Props) => {
  const [status, setStatus] = useState("pending");
  const [error, setError] = useState(null);
  const scanSubscription = useRef(null);
  const prevAccountCount = useRef(migratableAccounts.length);
  const prevCurrencyIds = useRef(currencyIds);

  const currency = navigation.getParam("currency");
  const deviceMeta = navigation.getParam("deviceMeta");

  const noticeAwareStatus =
    status === "done" && prevAccountCount.current === migratableAccounts.length
      ? "notice"
      : status;

  const finishedWithDevice =
    migratableAccounts.length &&
    prevCurrencyIds.current &&
    prevCurrencyIds.current[prevCurrencyIds.current.length - 1] === currency.id;

  const nextCurrency =
    migratableAccounts.length && !finishedWithDevice
      ? getCryptoCurrencyById(currencyIds[currencyIds.indexOf(currency.id) + 1])
      : null;

  const unsub = useCallback(() => {
    if (scanSubscription.current) {
      scanSubscription.current.unsubscribe();
    }
  }, [scanSubscription]);

  const navigateToNextStep = useCallback(() => {
    if (migratableAccounts.length) {
      if (finishedWithDevice) {
        navigation.navigate(ScreenName.MigrateAccountsOverview, {
          showNotice: noticeAwareStatus !== "error",
        });
      } else {
        navigation.navigate(ScreenName.MigrateAccountsConnectDevice, {
          deviceMeta,
          currency: noticeAwareStatus === "error" ? currency : nextCurrency,
        });
      }
    } else if (navigation.dismiss) {
      const dismissed = navigation.dismiss();
      if (!dismissed) navigation.goBack();
    }
  }, [
    navigation,
    deviceMeta,
    migratableAccounts,
    finishedWithDevice,
    nextCurrency,
    currency,
    noticeAwareStatus,
  ]);

  const { deviceId } = deviceMeta;
  const startScanAccountsDevice = useCallback(() => {
    const syncConfig = {
      // TODO later we need to paginate only a few ops, not all (for add accounts)
      // paginationConfig will come from redux
      paginationConfig: {},
    };
    unsub();
    scanSubscription.current = getCurrencyBridge(currency)
      .scanAccounts({ currency, deviceId, syncConfig })
      .pipe(
        reduce(
          (all: Account[], event: ScanAccountEvent) =>
            all.concat(event.account),
          [],
        ),
      )
      .subscribe({
        next: scannedAccounts => {
          setAccounts(
            migrateAccounts({ scannedAccounts, existingAccounts: accounts }),
          );
          setStatus("done");
        },
        error: err => {
          logger.critical(err);
          setStatus("error");
          setError(err);
        },
      });
  }, [currency, deviceId, setAccounts, unsub, accounts, setStatus, setError]);

  useEffect(() => {
    startScanAccountsDevice();
    return unsub;
  }, [startScanAccountsDevice, unsub]);

  return (
    <SafeAreaView
      forceInset={forceInset}
      style={[styles.root, { paddingTop: extraStatusBarPadding }]}
    >
      <View style={styles.content}>
        <RoundedCurrencyIcon
          currency={currency}
          size={32}
          extra={noticeAwareStatus}
        />
        <LText style={styles.title} semiBold>
          {status === "error" ? (
            <TranslatedError error={error} field="title" />
          ) : (
            <Trans
              i18nKey={`migrateAccounts.progress.${noticeAwareStatus}.title`}
              values={{ currency: currency.name }}
            />
          )}
        </LText>
        <LText style={styles.subtitle}>
          {noticeAwareStatus === "error" ? (
            <TranslatedError error={error} field="description" />
          ) : (
            <Trans
              i18nKey={`migrateAccounts.progress.${noticeAwareStatus}.subtitle`}
              values={{ currency: currency.name }}
            />
          )}
        </LText>
      </View>

      {status !== "pending" ? (
        <View style={styles.buttonWrapper}>
          <Button
            event={`MigrationCTA_${noticeAwareStatus}`}
            type="primary"
            title={
              <Trans
                i18nKey={`migrateAccounts.progress.${noticeAwareStatus}.${
                  noticeAwareStatus
                    ? "cta"
                    : migratableAccounts.length
                    ? finishedWithDevice
                      ? "cta"
                      : "ctaNextCurrency"
                    : "ctaDone"
                }`}
                values={{ currency: nextCurrency && nextCurrency.name }}
              />
            }
            onPress={navigateToNextStep}
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noAccountsMigrated: {
    backgroundColor: rgba(colors.live, 0.1),
    marginHorizontal: 8,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
  },
  noAccountsMigratedText: {
    color: colors.live,
    alignSelf: "center",
    fontSize: 14,
    marginLeft: 12,
  },
  title: {
    marginHorizontal: 20,
    marginTop: 16,
    color: colors.darkBlue,
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    marginHorizontal: 20,
    marginBottom: 24,
    color: colors.smoke,
    fontSize: 14,
    textAlign: "center",
  },
  buttonWrapper: {
    padding: 16,
    width: "100%",
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withNavigation(Progress));
