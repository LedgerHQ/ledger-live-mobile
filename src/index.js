// @flow
/* eslint-disable import/first */
import "../shim";
import "./polyfill";
import "./live-common-setup";
import "./implement-react-native-libcore";
import "react-native-gesture-handler";
import React, { Component } from "react";
import { connect } from "react-redux";
import { StyleSheet, View, Text } from "react-native";
import SplashScreen from "react-native-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import Transport from "@ledgerhq/hw-transport";
import { NotEnoughBalance } from "@ledgerhq/errors";
import { log } from "@ledgerhq/logs";
import { checkLibs } from "@ledgerhq/live-common/lib/sanityChecks";
import logger from "./logger";
import { exportSelector as settingsExportSelector } from "./reducers/settings";
import { exportSelector as accountsExportSelector } from "./reducers/accounts";
import { exportSelector as bleSelector } from "./reducers/ble";
import CounterValues from "./countervalues";
import LocaleProvider from "./context/Locale";
import RebootProvider from "./context/Reboot";
import ButtonUseTouchable from "./context/ButtonUseTouchable";
import AuthPass from "./context/AuthPass";
import LedgerStoreProvider from "./context/LedgerStore";
import LoadingApp from "./components/LoadingApp";
import StyledStatusBar from "./components/StyledStatusBar";
import { BridgeSyncProvider } from "./bridge/BridgeSyncContext";
import DBSave from "./components/DBSave";
import DebugRejectSwitch from "./components/DebugRejectSwitch";
import useAppStateListener from "./components/useAppStateListener";
import SyncNewAccounts from "./bridge/SyncNewAccounts";
import { OnboardingContextProvider } from "./screens/Onboarding/onboardingContext";
import HookAnalytics from "./analytics/HookAnalytics";
import HookSentry from "./components/HookSentry";
// import AppContainer from "./navigators";
import { SettingsStack } from "./components/Navigation";
import SetEnvsFromSettings from "./components/SetEnvsFromSettings";

checkLibs({
  NotEnoughBalance,
  React,
  log,
  Transport,
  connect,
});

// useScreens();
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

// Fixme until third parties address this themselves
// $FlowFixMe
Text.defaultProps = Text.defaultProps || {};
// $FlowFixMe
Text.defaultProps.allowFontScaling = false;

interface AppProps {
  importDataString: boolean;
}

function App({ importDataString }: AppProps) {
  useAppStateListener();

  function hasCountervaluesChanged(a, b): boolean {
    return a.countervalues !== b.countervalues;
  }

  function hasSettingsChanged(a, b): boolean {
    return a.settings !== b.settings;
  }

  function hasAccountsChanged(a, b): boolean {
    return a.accounts !== b.accounts;
  }

  function hasBleChanged(a, b): boolean {
    return a.ble !== b.ble;
  }

  return (
    <View style={styles.root}>
      <DBSave
        dbKey="countervalues"
        throttle={2000}
        hasChanged={hasCountervaluesChanged}
        lense={CounterValues.exportSelector}
      />
      <DBSave
        dbKey="settings"
        throttle={400}
        hasChanged={hasSettingsChanged}
        lense={settingsExportSelector}
      />
      <DBSave
        dbKey="accounts"
        throttle={500}
        hasChanged={hasAccountsChanged}
        lense={accountsExportSelector}
      />
      <DBSave
        dbKey="ble"
        throttle={500}
        hasChanged={hasBleChanged}
        lense={bleSelector}
      />

      <SyncNewAccounts priority={5} />

      {/* <AppContainer screenProps={{ importDataString }} /> */}
      <SettingsStack />

      <DebugRejectSwitch />
    </View>
  );
}

export default class Root extends Component<
  { importDataString?: string },
  { appState: * },
> {
  initTimeout: *;

  componentWillUnmount() {
    clearTimeout(this.initTimeout);
  }

  componentDidCatch(e: *) {
    logger.critical(e);
    throw e;
  }

  onInitFinished = () => {
    this.initTimeout = setTimeout(() => SplashScreen.hide(), 300);
  };

  onRebootStart = () => {
    clearTimeout(this.initTimeout);
    if (SplashScreen.show) SplashScreen.show(); // on iOS it seems to not be exposed
  };

  render() {
    const importDataString = __DEV__ && this.props.importDataString;

    return (
      <RebootProvider onRebootStart={this.onRebootStart}>
        <LedgerStoreProvider onInitFinished={this.onInitFinished}>
          {(ready, store) =>
            ready ? (
              <NavigationContainer>
                <StyledStatusBar />
                <SetEnvsFromSettings />
                <HookSentry />
                <HookAnalytics store={store} />
                <AuthPass>
                  <LocaleProvider>
                    <BridgeSyncProvider>
                      <CounterValues.PollingProvider>
                        <ButtonUseTouchable.Provider value={true}>
                          <OnboardingContextProvider>
                            <App importDataString={importDataString} />
                          </OnboardingContextProvider>
                        </ButtonUseTouchable.Provider>
                      </CounterValues.PollingProvider>
                    </BridgeSyncProvider>
                  </LocaleProvider>
                </AuthPass>
              </NavigationContainer>
            ) : (
              <LoadingApp />
            )
          }
        </LedgerStoreProvider>
      </RebootProvider>
    );
  }
}

if (__DEV__) {
  require("./snoopy");
}
