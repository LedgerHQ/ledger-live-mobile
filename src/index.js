// @flow
/* eslint-disable import/first */
import "../shim";
import "./polyfill";
import "./live-common-setup";
import "./implement-react-native-libcore";
import React, { Component } from "react";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";
import { DeviceEventEmitter, StyleSheet, View, Text } from "react-native";
import SplashScreen from "react-native-splash-screen";
import QuickActions from "react-native-quick-actions";
import i18next from "i18next";
import { createStructuredSelector } from "reselect";
import logger from "./logger";
import {
  exportSelector as settingsExportSelector,
  readOnlyModeEnabledSelector,
} from "./reducers/settings";
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
import AppStateListener from "./components/AppStateListener";
import SyncNewAccounts from "./bridge/SyncNewAccounts";
import { OnboardingContextProvider } from "./screens/Onboarding/onboardingContext";
import HookAnalytics from "./analytics/HookAnalytics";
import HookSentry from "./components/HookSentry";
import AppContainer from "./navigators";
import SetEnvsFromSettings from "./components/SetEnvsFromSettings";

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

const mapStateToProps = createStructuredSelector({
  readOnlyModeEnabled: readOnlyModeEnabledSelector,
});

class AppInner extends Component<*> {
  hasCountervaluesChanged = (a, b) => a.countervalues !== b.countervalues;

  hasSettingsChanged = (a, b) => a.settings !== b.settings;

  hasAccountsChanged = (a, b) => a.accounts !== b.accounts;

  hasBleChanged = (a, b) => a.ble !== b.ble;

  handleQuickAction = data => {
    if (data && data.type) {
      this.navigator &&
        this.navigator.dispatch(
          NavigationActions.navigate({ routeName: data.userInfo.url }),
        );
    }
  };

  navigator: *;

  componentDidMount(): void {
    const { readOnlyModeEnabled } = this.props;

    DeviceEventEmitter.addListener(
      "quickActionShortcut",
      this.handleQuickAction,
    );

    QuickActions.popInitialAction().then(this.handleQuickAction);
    const options = [
      {
        type: "receive",
        title: i18next.t("quickActions.receive"),
        icon: "receive",
        userInfo: { url: "ReceiveFunds" },
      },
      {
        type: "send",
        title: i18next.t("quickActions.send"),
        icon: "send",
        userInfo: { url: "SendFunds" },
      },
      {
        type: "accounts",
        title: i18next.t("quickActions.accounts"),
        icon: "accounts",
        userInfo: { url: "Accounts" },
      },
    ];

    if (!readOnlyModeEnabled) {
      options.push({
        type: "manager",
        title: i18next.t("quickActions.manager"),
        icon: "manager",
        userInfo: { url: "Manager" },
      });
    }
    QuickActions.setShortcutItems(options);
  }

  render() {
    const { importDataString } = this.props;

    return (
      <View style={styles.root}>
        <DBSave
          dbKey="countervalues"
          throttle={2000}
          hasChanged={this.hasCountervaluesChanged}
          lense={CounterValues.exportSelector}
        />
        <DBSave
          dbKey="settings"
          throttle={400}
          hasChanged={this.hasSettingsChanged}
          lense={settingsExportSelector}
        />
        <DBSave
          dbKey="accounts"
          throttle={500}
          hasChanged={this.hasAccountsChanged}
          lense={accountsExportSelector}
        />
        <DBSave
          dbKey="ble"
          throttle={500}
          hasChanged={this.hasBleChanged}
          lense={bleSelector}
        />

        <AppStateListener />

        <SyncNewAccounts priority={5} />
        <AppContainer
          screenProps={{ importDataString }}
          ref={nav => {
            this.navigator = nav;
          }}
        />
        <DebugRejectSwitch />
      </View>
    );
  }
}

const App = connect(mapStateToProps)(AppInner);

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
              <>
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
              </>
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
