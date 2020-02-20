// @flow

import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import type { NavigationScreenProp } from "react-navigation";
import { withNavigation } from "@react-navigation/compat";
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import colors from "../../colors";
import LText from "../../components/LText";
import IconArrowRight from "../../icons/ArrowRight";
import LiveLogo from "../../icons/LiveLogoIcon";
import { someAccountsNeedMigrationSelector } from "../../reducers/accounts";

const mapStateToProps = createStructuredSelector({
  someAccountsNeedMigrationSelector,
});

const Banner = ({
  navigation,
  someAccountsNeedMigrationSelector,
}: {
  someAccountsNeedMigrationSelector: boolean,
  navigation: NavigationScreenProp<*>,
}) => {
  const navigateToAccountMigration = useCallback(() => {
    navigation.navigate("MigrateAccountsOverview");
  }, [navigation]);

  if (!someAccountsNeedMigrationSelector) return null;

  return (
    <TouchableOpacity style={styles.root} onPress={navigateToAccountMigration}>
      <View style={styles.logo}>
        <LiveLogo size={16} color={colors.white} />
      </View>
      <LText semiBold style={styles.text}>
        <Trans i18nKey="migrateAccounts.banner" />
      </LText>
      <View style={styles.arrow}>
        <IconArrowRight size={16} color={colors.white} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    margin: 16,
    borderRadius: 4,
    flexDirection: "row",
    height: 48,
    backgroundColor: colors.live,
    display: "flex",
    alignItems: "center",
  },
  text: {
    marginLeft: 12,
    color: colors.white,
    fontSize: 14,
    flex: 1,
    textAlign: "left",
  },
  logo: {
    marginLeft: 12,
  },
  arrow: {
    marginRight: 8,
  },
});

export default compose(withNavigation, connect(mapStateToProps))(Banner);
