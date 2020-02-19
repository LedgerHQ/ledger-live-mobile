/* @flow */
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/dist/Feather";
import Config from "react-native-config";
import type { NavigationScreenProp } from "react-navigation";
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import i18next from "i18next";
import { cryptoCurrenciesSelector } from "../../reducers/accounts";
import type { T } from "../../types/common";
import SettingsCard from "../../components/SettingsCard";
import PoweredByLedger from "./PoweredByLedger";
import Assets from "../../icons/Assets";
import LiveLogoIcon from "../../icons/LiveLogoIcon";
import Atom from "../../icons/Atom";
import Help from "../../icons/Help";
import Display from "../../icons/Display";
import colors from "../../colors";
import TrackScreen from "../../analytics/TrackScreen";
import timer from "../../timer";

// We can extend specific type for screen components from typescritpt definitions later
interface Props {
  navigation: NavigationScreenProp<*>;
}

export default function Settings({ navigation }: Props) {
  const { t } = useTranslation();
  const currencies = useSelector(cryptoCurrenciesSelector);

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

  function onDebugHiddenPress(): void {
    if (debugTimeout) debugTimeout.current();
    count.current++;
    if (count.current > 6) {
      count.current = 0;
      setDebugVisible(!debugVisible);
    } else {
      onTimeout();
    }
  }

  return (
    <ScrollView>
      <TrackScreen category="Settings" />
      <View style={styles.root}>
        <SettingsCard
          title={t("settings.display.title")}
          desc={t("settings.display.desc")}
          icon={<Display size={16} color={colors.live} />}
          onClick={() => navigation.navigate("GeneralSettings")}
        />
        {currencies.length > 0 && (
          <SettingsCard
            title={t("settings.cryptoAssets.title")}
            desc={t("settings.cryptoAssets.desc")}
            icon={<Assets size={16} color={colors.live} />}
            onClick={() => navigation.navigate("CryptoAssetsSettings")}
          />
        )}
        <SettingsCard
          title={t("settings.about.title")}
          desc={t("settings.about.desc")}
          icon={<LiveLogoIcon size={16} color={colors.live} />}
          onClick={() => navigation.navigate("AboutSettings")}
        />
        <SettingsCard
          title={t("settings.help.title")}
          desc={t("settings.help.desc")}
          icon={<Help size={16} color={colors.live} />}
          onClick={() => navigation.navigate("HelpSettings")}
        />
        <SettingsCard
          title={t("settings.experimental.title")}
          desc={t("settings.experimental.desc")}
          icon={<Atom size={16} color={colors.live} />}
          onClick={() => navigation.navigate("ExperimentalSettings")}
        />
        {debugVisible ? (
          <SettingsCard
            title="Debug"
            desc="Use at your own risk – Developer tools"
            icon={<Icon name="wind" size={16} color={colors.live} />}
            onClick={() => navigation.navigate("DebugSettings")}
          />
        ) : null}
        <TouchableWithoutFeedback onPress={onDebugHiddenPress}>
          <View>
            <PoweredByLedger />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </ScrollView>
  );
}

// class Settings extends Component<Props, *> {
//   static navigationOptions = {
//     title: i18next.t("settings.header"),
//   };
// }

const styles = StyleSheet.create({
  root: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 64,
  },
});
