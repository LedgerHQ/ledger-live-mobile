// @flow
import React, { Component, Fragment } from "react";
import { View, StyleSheet, PanResponder } from "react-native";

// $FlowFixMe
import { HeaderBackButton, SectionList } from "react-navigation";
import groupBy from "lodash/groupBy";
import concat from "lodash/concat";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import type { NavigationScreenProp } from "react-navigation";
import type { Account } from "@ledgerhq/live-common/lib/types";
import type { Result } from "@ledgerhq/live-common/lib/cross";
import { accountDataToAccount } from "@ledgerhq/live-common/lib/cross";
import { translate, Trans } from "react-i18next";
import i18next from "i18next";

import logger from "../../logger";
import { supportsExistingAccount } from "../../cryptocurrencies";
import { importDesktopSettings } from "../../actions/settings";
import { addAccount, updateAccount } from "../../actions/accounts";
import { accountsSelector } from "../../reducers/accounts";
import { TrackScreen } from "../../analytics";
import LText from "../../components/LText";
import colors from "../../colors";
import Button from "../../components/Button";
import StyledStatusBar from "../../components/StyledStatusBar";
import DisplayResultItem from "./DisplayResultItem";
import DisplayResultSettingsSection from "./DisplayResultSettingsSection";
import ResultSection from "./ResultSection";
import HeaderBackImage from "../../components/HeaderBackImage";

type Item = {
  // current account, might be partially completed as sync happen in background
  account: Account,
  // create: account is a new entity to create
  // patch: account exists and need to be patched
  // id: account exists and nothing changes
  // unsupported: we can't support adding this account
  mode: "create" | "patch" | "id" | "unsupported",
};

type Props = {
  navigation: NavigationScreenProp<{
    params: {
      result: Result,
      onFinish?: (NavigationScreenProp<*>) => void,
    },
  }>,
  accounts: Account[],
  addAccount: Account => void,
  updateAccount: ($Shape<Account>) => void,
  importDesktopSettings: (*) => void,
};

type State = {
  selectedAccounts: string[],
  items: Item[],
  importing: boolean,
  importSettings: boolean,
  openIndex: number,
};

const itemModeDisplaySort = {
  create: 1,
  patch: 2,
  id: 3,
  unsupported: 4,
};

const BackButton = ({ navigation }: { navigation: NavigationScreenProp }) => (
  <HeaderBackButton
    tintColor={colors.grey}
    onPress={() => navigation.replace("ScanAccounts")}
  >
    <HeaderBackImage />
  </HeaderBackButton>
);

class DisplayResult extends Component<Props, State> {
  state = {
    selectedAccounts: [],
    items: [],
    importSettings: true,
    importing: false,
    openIndex: -1,
  };

  unmounted = false;

  componentWillUnmount() {
    this.unmounted = true;
  }

  static navigationOptions = ({ navigation }) => ({
    title: i18next.t("account.import.result.title"),
    headerLeft: <BackButton navigation={navigation} />,
  });

  onRetry = () => {
    const { navigation } = this.props;
    navigation.replace("ScanAccounts");
  };

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const items = nextProps.navigation
      .getParam("result")
      .accounts.map(
        (accInput: *): ?Item => {
          const prevItem = prevState.items.find(
            item => item.account.id === accInput.id,
          );
          if (prevItem) return prevItem;
          const existingAccount = nextProps.accounts.find(
            a => a.id === accInput.id,
          );
          if (existingAccount) {
            // only the name is supposed to change. rest is never changing
            if (existingAccount.name === accInput.name) {
              return {
                account: existingAccount,
                mode: "id",
              };
            }
            return {
              account: { ...existingAccount, name: accInput.name },
              mode: "patch",
            };
          }
          try {
            const account = accountDataToAccount(accInput);
            return {
              account,
              mode: supportsExistingAccount(accInput)
                ? "create"
                : "unsupported",
            };
          } catch (e) {
            logger.critical(e);
            return null;
          }
        },
      )
      .filter(Boolean)
      .sort(
        (a, b) => itemModeDisplaySort[a.mode] - itemModeDisplaySort[b.mode],
      );

    let selectedAccounts = prevState.selectedAccounts;
    if (prevState.items.length === 0) {
      // select all by default
      selectedAccounts = items.reduce(
        (acc, cur) =>
          cur.mode === "create" || cur.mode === "patch"
            ? concat(acc, cur.account.id)
            : acc,
        [],
      );
    }
    return { items, selectedAccounts };
  }

  close = () => {
    const { navigation } = this.props;
    // $FlowFixMe
    navigation.dismiss();
  };

  onImport = async () => {
    const {
      addAccount,
      updateAccount,
      importDesktopSettings,
      navigation,
    } = this.props;
    const { selectedAccounts, items, importSettings } = this.state;
    const onFinish = navigation.getParam("onFinish");
    this.setState({ importing: true });
    const selectedItems = items.filter(item =>
      selectedAccounts.includes(item.account.id),
    );
    for (const { mode, account } of selectedItems) {
      switch (mode) {
        case "create":
          addAccount(account);
          break;
        case "patch":
          updateAccount({ id: account.id, name: account.name });
          break;
        default:
      }
    }

    if (importSettings) {
      importDesktopSettings(navigation.getParam("result").settings);
    }

    if (onFinish) onFinish(navigation);
    else navigation.navigate("Accounts");
  };

  onSwitchResultItem = (checked: boolean, account: Account) => {
    if (checked) {
      this.setState(({ selectedAccounts }) => ({
        selectedAccounts: selectedAccounts.concat(account.id),
      }));
    } else {
      this.setState(({ selectedAccounts }) => ({
        selectedAccounts: selectedAccounts.filter(s => s !== account.id),
      }));
    }
  };

  onAccountNameChange = (name: string, account: Account) => {
    this.setState(prevState => ({
      items: prevState.items.map(
        item =>
          item.account.id === account.id
            ? { ...item, account: { ...account, name } }
            : item,
      ),
    }));
  };

  signalOtherRows = openIndex => this.setState({ openIndex });

  renderItem = ({ item: { account, mode }, index }) => {
    const { openIndex } = this.state;

    return (
      <DisplayResultItem
        key={account.id}
        account={account}
        mode={mode}
        index={index}
        openIndex={openIndex}
        checked={this.state.selectedAccounts.some(s => s === account.id)}
        onSwitch={this.onSwitchResultItem}
        onAccountNameChange={this.onAccountNameChange}
        signalOtherRows={this.signalOtherRows}
        importing={this.state.importing}
      />
    );
  };

  renderSectionHeader = ({ section: { mode } }) => (
    <ResultSection mode={mode} />
  );

  onSwitchSettings = importSettings => this.setState({ importSettings });

  ListFooterComponent = () => (
    <DisplayResultSettingsSection
      onSwitch={this.onSwitchSettings}
      checked={this.state.importSettings}
    />
  );

  ListEmptyComponent = () => (
    <View>
      <ResultSection mode="empty" />
      <LText style={styles.emptyNotice}>
        <Trans i18nKey="account.import.result.descEmpty">
          <LText semiBold>No accounts</LText>
          {
            "found on your desktop app, please try again or continue the onboarding."
          }
        </Trans>
      </LText>
    </View>
  );

  keyExtractor = item => item.account.id;

  render() {
    const { items } = this.state;

    const itemsGroupedByMode = groupBy(items, "mode");

    return (
      <View style={styles.root}>
        <TrackScreen category="ImportAccounts" name="DisplayResult" />
        <StyledStatusBar />
        <Fragment>
          <SectionList
            style={styles.body}
            contentContainerStyle={styles.list}
            renderItem={this.renderItem}
            renderSectionHeader={this.renderSectionHeader}
            ListFooterComponent={this.ListFooterComponent}
            ListEmptyComponent={this.ListEmptyComponent}
            keyExtractor={this.keyExtractor}
            sections={Object.keys(itemsGroupedByMode).map(mode => ({
              mode,
              data: itemsGroupedByMode[mode],
            }))}
          />
          <View style={styles.footer}>
            <Button
              event="ImportAccountsRetry"
              containerStyle={[styles.button, styles.retry]}
              type="secondary"
              title={<Trans i18nKey="common.retry" />}
              onPress={this.onRetry}
            />
            <Button
              event="ImportAccountsContinue"
              containerStyle={styles.button}
              type="primary"
              title={<Trans i18nKey="common.import" />}
              onPress={this.onImport}
            />
          </View>
        </Fragment>
      </View>
    );
  }
}

export default translate()(
  connect(
    createStructuredSelector({ accounts: accountsSelector }),
    {
      addAccount,
      updateAccount,
      importDesktopSettings,
    },
  )(DisplayResult),
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexGrow: 1,
    flexDirection: "column",
    alignSelf: "stretch",
    justifyContent: "space-between",
    backgroundColor: colors.white,
  },
  body: {
    flex: 1,
  },
  footer: {
    padding: 20,
    flexDirection: "row",
  },
  button: {
    flex: 1,
  },
  retry: {
    marginRight: 8,
  },
  list: {
    paddingBottom: 40,
  },
  sectionHeaderText: {
    backgroundColor: colors.white,
    color: colors.grey,
    fontSize: 14,
    paddingTop: 10,
    paddingBottom: 10,
  },
  emptyNotice: {
    marginLeft: 8,
    paddingHorizontal: 12,
  },
  noAccountText: {
    flex: 1,
    fontSize: 16,
  },
});
