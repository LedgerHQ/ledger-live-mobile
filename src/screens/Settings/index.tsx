import React, { useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import {
  MobileMedium,
  WalletMedium,
  BracketsMedium,
  LifeRingMedium,
  ChartNetworkMedium,
} from "@ledgerhq/native-ui/assets/icons";
import Config from "react-native-config";
import { ScreenName } from "../../const";
import { accountsSelector } from "../../reducers/accounts";
import SettingsCard from "../../components/SettingsCard";
import PoweredByLedger from "./PoweredByLedger";
import TrackScreen from "../../analytics/TrackScreen";
import timer from "../../timer";
import NavigationScrollView from "../../components/NavigationScrollView";

type Props = {
  navigation: any;
};

export default function Settings({ navigation }: Props) {
  const { t } = useTranslation();
  const accounts = useSelector(accountsSelector);

  const [debugVisible, setDebugVisible] = useState(
    Config.FORCE_DEBUG_VISIBLE || false,
  );
  const count = useRef(0);
  const debugTimeout = useRef(onTimeout);

  function onTimeout(): void {
    timer.timeout(() => {
      count.current = 0;
    }, 1000);
  }

  const onDebugHiddenPress = useCallback(() => {
    if (debugTimeout) debugTimeout.current();
    count.current++;
    if (count.current > 6) {
      count.current = 0;
      setDebugVisible(!debugVisible);
    } else {
      onTimeout();
    }
  }, [debugVisible]);

  return (
    <NavigationScrollView>
      <TrackScreen category="Settings" />
      <View style={styles.root}>
        <SettingsCard
          title={t("settings.display.title")}
          desc={t("settings.display.desc")}
          Icon={MobileMedium}
          onClick={() => navigation.navigate(ScreenName.GeneralSettings)}
        />
        {accounts.length > 0 && (
          <SettingsCard
            title={t("settings.accounts.title")}
            desc={t("settings.accounts.desc")}
            Icon={WalletMedium}
            onClick={() => navigation.navigate(ScreenName.AccountsSettings)}
          />
        )}
        <SettingsCard
          title={t("settings.about.title")}
          desc={t("settings.about.desc")}
          Icon={BracketsMedium}
          onClick={() => navigation.navigate(ScreenName.AboutSettings)}
        />
        <SettingsCard
          title={t("settings.help.title")}
          desc={t("settings.help.desc")}
          Icon={LifeRingMedium}
          onClick={() => navigation.navigate(ScreenName.HelpSettings)}
        />
        <SettingsCard
          title={t("settings.experimental.title")}
          desc={t("settings.experimental.desc")}
          Icon={ChartNetworkMedium}
          onClick={() => navigation.navigate(ScreenName.ExperimentalSettings)}
        />
        {debugVisible || __DEV__ ? (
          <SettingsCard
            title="Debug"
            desc="Use at your own risk – Developer tools"
            Icon={ChartNetworkMedium}
            onClick={() => navigation.navigate(ScreenName.DebugSettings)}
          />
        ) : null}
        <TouchableWithoutFeedback onPress={onDebugHiddenPress}>
          <View>
            <PoweredByLedger />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </NavigationScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 64,
  },
});
