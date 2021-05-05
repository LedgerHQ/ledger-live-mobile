// @flow

import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Trans, useTranslation } from "react-i18next";
import SafeAreaView from "react-native-safe-area-view";

import Item from "./Item";
import Button from "../../../components/Button";
import LText from "../../../components/LText";

// import WyreIcon from "../../../icons/swap/Wyre";
import ChangellyIcon from "../../../icons/swap/Changelly";
import ParaswapIcon from "../../../icons/swap/Paraswap";

const Provider = ({ onContinue }: { onContinue: string => void }) => {
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState();
  const rows = false;

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView style={styles.providerList}>
        <LText style={styles.title} semiBold secondary>
          <Trans i18nKey={"transfer.swap.providers.title"} />
        </LText>
        <Item
          rows={rows}
          id={"paraswap"}
          onSelect={setSelectedItem}
          selected={selectedItem}
          Icon={ParaswapIcon}
          title={t("transfer.swap.providers.paraswap.title")}
          bullets={[
            t("transfer.swap.providers.paraswap.bullet.0"),
            t("transfer.swap.providers.paraswap.bullet.1"),
            t("transfer.swap.providers.paraswap.bullet.2"),
          ]}
        />
        <Item
          rows={rows}
          id={"changelly"}
          onSelect={setSelectedItem}
          selected={selectedItem}
          Icon={ChangellyIcon}
          title={t("transfer.swap.providers.changelly.title")}
          bullets={[
            t("transfer.swap.providers.changelly.bullet.0"),
            t("transfer.swap.providers.changelly.bullet.1"),
            t("transfer.swap.providers.changelly.bullet.2"),
          ]}
        />
        {__DEV__ && (
          <Item
            rows={rows}
            id={"debug"}
            onSelect={setSelectedItem}
            selected={selectedItem}
            title={"Debug"}
            bullets={["test app"]}
          />
        )}
        {/* <Item
          rows={rows}
          id={"wyre"}
          onSelect={setSelectedItem}
          selected={selectedItem}
          Icon={WyreIcon}
          kyc
          title={t("transfer.swap.providers.wyre.title")}
          bullets={[
            t("transfer.swap.providers.wyre.bullet.0"),
            t("transfer.swap.providers.wyre.bullet.1"),
            t("transfer.swap.providers.wyre.bullet.2"),
          ]}
        /> */}
      </ScrollView>
      <View style={styles.footer}>
        <Button
          type={"primary"}
          title={t("transfer.swap.providers.cta")}
          onPress={() => {
            selectedItem && onContinue(selectedItem);
          }}
          disabled={!selectedItem}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    lineHeight: 22,
    textAlign: "center",
    marginVertical: 24,
  },
  providerList: {
    paddingHorizontal: 16,
  },
  footer: {
    padding: 16,
  },
});

export default Provider;
