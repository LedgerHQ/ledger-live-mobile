// @flow

import React, { useCallback, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Trans, useTranslation } from "react-i18next";
import SafeAreaView from "react-native-safe-area-view";

import Item from "./Item";
import Button from "../../../components/Button";
import LText from "../../../components/LText";

import IconChangelly from "../../../icons/swap/Changelly";
import IconParaswap from "../../../icons/swap/Paraswap";
import IconWyre from "../../../icons/swap/Wyre";
import LiveAppIcon from "../../../icons/LiveLogo";

// Consider moving this logic to live-common (cc Remi/Hakim)
const PROVIDERS = {
  paraswap: {
    id: "paraswap",
    name: "ParaSwap",
    isDapp: true,
    icon: <IconParaswap size={32} />,
    kycRequired: false,
  },
  // Centralized
  changelly: {
    id: "changelly",
    name: "Changelly",
    isDapp: false,
    icon: <IconChangelly size={32} />,
    kycRequired: false,
  },
  wyre: {
    id: "wyre",
    name: "Wyre",
    isDapp: false,
    icon: <IconWyre size={32} />,
    kycRequired: true,
  },
  // Debug
  debug: {
    id: "debug",
    name: "Debugger",
    isDapp: true,
    icon: <LiveAppIcon color={"blue"} name="Debugger" size={32} />, // FIXME color
    disabled: false,
    kycRequired: false,
  },
};

const Providers = ({
  providers,
  onContinue,
}: {
  providers: { [string]: any },
  onContinue: (string, boolean) => void,
}) => {
  const { t } = useTranslation();
  const [provider, setProvider] = useState();
  const providersWithConf = providers.map(p => PROVIDERS[p]).filter(Boolean); // Nb Cover missing provider
  const noCentralizedProviders = !providersWithConf.find(p => !p.isDapp);

  const getBullets = id =>
    t(`transfer.swap.providers.${id}.bullets`, {
      joinArrays: ";",
      defaultValue: "",
    })
      .split(";")
      .filter(Boolean);

  const onContinueWrapper = useCallback(() => {
    if (provider) {
      const conf = PROVIDERS[provider];
      onContinue(provider, conf.isDapp);
    }
  }, [onContinue, provider]);

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView style={styles.providerList}>
        <LText style={styles.title} semiBold secondary>
          <Trans i18nKey={"transfer.swap.providers.title"} />
        </LText>
        {providersWithConf.map(({ id, icon, name, kycRequired }) => (
          <Item
            key={id}
            id={id}
            kyc={kycRequired}
            onSelect={setProvider}
            selected={provider}
            icon={icon}
            title={name}
            description={t(`swap.providers.${id}.description`, {
              defaultValue: "",
            })}
            bullets={getBullets(id)}
          />
        ))}
        {noCentralizedProviders ? (
          <Item
            key="changelly"
            id="changelly"
            title="Changelly"
            bullets={getBullets("changelly")}
            icon={<IconChangelly size={32} />}
            disabled
          />
        ) : null}
      </ScrollView>
      <View style={styles.footer}>
        <Button
          type={"primary"}
          title={t("transfer.swap.providers.cta")}
          onPress={onContinueWrapper}
          disabled={!provider}
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

export default Providers;
