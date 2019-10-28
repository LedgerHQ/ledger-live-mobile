// @flow

import React, { useCallback, useState, useMemo } from "react";
import { compose } from "redux";
import { Trans } from "react-i18next";
import take from "lodash/take";
import { FlatList, Platform, StyleSheet, View } from "react-native";
import type { Account, SubAccount } from "@ledgerhq/live-common/lib/types";
import Icon from "react-native-vector-icons/dist/FontAwesome";
import MaterialIcon from "react-native-vector-icons/dist/MaterialIcons";
import { withNavigation } from "react-navigation";
import { listSubAccounts } from "@ledgerhq/live-common/lib/account";
import { listTokenTypesForCryptoCurrency } from "@ledgerhq/live-common/lib/currencies";
import SubAccountRow from "../../components/SubAccountRow";
import withEnv from "../../logic/withEnv";
import colors from "../../colors";
import LText from "../../components/LText";
import Button from "../../components/Button";
import Touchable from "../../components/Touchable";

const keyExtractor = o => o.id;

const styles = StyleSheet.create({
  footer: {
    borderRadius: 4,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: colors.fog,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  footerText: {
    flex: 1,
    flexShrink: 1,
    flexWrap: "wrap",
    paddingLeft: 12,
    flexDirection: "row",
  },
  header: {
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subAccountList: {
    paddingTop: 32,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 24,
  },
  card: {
    marginBottom: 8,
    backgroundColor: colors.white,
    borderRadius: 4,
    ...Platform.select({
      android: {
        elevation: 1,
      },
      ios: {
        shadowColor: colors.black,
        shadowOpacity: 0.03,
        shadowRadius: 8,
        shadowOffset: {
          height: 4,
        },
      },
    }),
  },
});

const Card = ({ children }: { children: any }) => (
  <View style={styles.card}>{children}</View>
);

const SubAccountsList = ({
  parentAccount,
  onAccountPress,
  navigation,
  accountId,
}: {
  parentAccount: Account,
  onAccountPress: SubAccount => *,
  navigation: *,
  accountId: string,
}) => {
  const [isCollapsed, setCollapsed] = useState(true);
  const subAccounts = listSubAccounts(parentAccount);

  const isToken = useMemo(
    () => listTokenTypesForCryptoCurrency(parentAccount.currency).length > 0,
    [parentAccount],
  );

  const renderHeader = useCallback(
    () => (
      <View style={styles.header}>
        <LText
          fontWeight="500"
          style={{ color: colors.darkBlue, fontSize: 16 }}
        >
          <Trans
            i18nKey={isToken ? "common.token" : "common.subaccount"}
            count={subAccounts.length}
          />
          {` (${subAccounts.length})`}
        </LText>
        {isToken && subAccounts.length > 0 ? (
          <Button
            containerStyle={{ width: 120 }}
            type="lightSecondary"
            event="AccountReceiveToken"
            title={<Trans i18nKey="account.tokens.addTokens" />}
            IconLeft={() => (
              <MaterialIcon color={colors.live} name="add" size={20} />
            )}
            onPress={() =>
              navigation.navigate("ReceiveConnectDevice", { accountId })
            }
            size={14}
          />
        ) : null}
      </View>
    ),
    [isToken, subAccounts, navigation, accountId],
  );

  const renderFooter = useCallback(() => {
    // If there are no sub accounts, we render the touchable rect
    if (subAccounts.length === 0) {
      return (
        <Touchable
          event="AccountReceiveSubAccount"
          onPress={() =>
            navigation.navigate("ReceiveConnectDevice", { accountId })
          }
        >
          <View style={styles.footer}>
            <Icon color={colors.live} size={26} name="plus" />
            <View style={styles.footerText}>
              <LText style={{ fontSize: 16 }}>
                <Trans i18nKey="account.tokens.howTo">
                  <LText semiBold>text</LText>
                  <LText semiBold>text</LText>
                </Trans>
              </LText>
            </View>
          </View>
        </Touchable>
      );
    }

    // If there is 3 or less sub accounts, no need for collapse button
    if (subAccounts.length <= 3) {
      return null;
    }

    // else, we render the collapse button
    return (
      <Card>
        <Button
          type="lightSecondary"
          event="accountExpandTokenList"
          title={
            <Trans
              i18nKey={
                isCollapsed
                  ? `account.${isToken ? "tokens" : "subaccounts"}.seeMore`
                  : `account.${isToken ? "tokens" : "subaccounts"}.seeLess`
              }
            />
          }
          IconRight={() => (
            <Icon
              color={colors.live}
              name={isCollapsed ? "angle-down" : "angle-up"}
              size={16}
            />
          )}
          onPress={() => setCollapsed(isCollapsed => !isCollapsed)}
          size={13}
        />
      </Card>
    );
  }, [subAccounts.length, isToken, isCollapsed, navigation, accountId]);

  const renderItem = useCallback(
    ({ item }) => (
      <Card>
        <SubAccountRow account={item} onSubAccountPress={onAccountPress} />
      </Card>
    ),
    [onAccountPress],
  );

  if (
    !isToken &&
    subAccounts.length === 0 &&
    parentAccount.currency.family === "tezos" // Scoped for Tezos now, might need to change with future coins integration
  ) {
    return null;
  }

  return (
    <View style={styles.subAccountList}>
      <FlatList
        data={isCollapsed ? take(subAccounts, 3) : subAccounts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

export default compose(
  withNavigation,
  withEnv("HIDE_EMPTY_TOKEN_ACCOUNTS"),
)(SubAccountsList);
