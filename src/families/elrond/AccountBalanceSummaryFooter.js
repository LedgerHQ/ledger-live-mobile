import React, { useCallback, useMemo, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@react-navigation/native";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account/helpers";
import { getCryptoCurrencyIcon } from "@ledgerhq/live-common/lib/reactNative";
import { BigNumber } from "bignumber.js";
import axios from "axios";

import InfoModal from "../../modals/Info";
import CurrencyUnitValue from "../../components/CurrencyUnitValue";
import InfoItem from "../../components/BalanceSummaryInfoItem";

import { constants } from "./constants";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "row",
    borderTopWidth: 1,
    paddingTop: 16,
    overflow: "visible",
  },
});

const withSummary = Component => props =>
  props.account.elrondResources || props.account.balance.gt(0) ? (
    <Component {...props} />
  ) : null;

const Summary = props => {
  const { account } = props;
  const { colors } = useTheme();
  const { t } = useTranslation();

  const unit = getAccountUnit(account);
  const currency = getCryptoCurrencyById(account.currency.family);
  const Elrond = getCryptoCurrencyIcon(currency);

  const [data, setData] = useState([]);
  const [delegationsResources, setDelegationResources] = useState(
    account.elrondResources.delegations || [],
  );

  const onCloseModal = useCallback(() => {
    setData([]);
  }, []);

  const fetchDelegations = useCallback(() => {
    const fetchData = async () => {
      try {
        const delegations = await axios.get(
          `${constants.delegations}/accounts/${account.freshAddress}/delegations`,
        );

        setDelegationResources(delegations.data);
      } catch (error) {
        setDelegationResources([]);
      }
    };

    if (account.elrondResources && !account.elrondResources.delegations) {
      fetchData();
    }

    return () =>
      setDelegationResources(account.elrondResources.delegations || []);
  }, [account.elrondResources, account.freshAddress]);

  const total = useCallback(
    key =>
      delegationsResources.reduce(
        (total, delegation) => total.plus(delegation[key]),
        BigNumber(0),
      ),
    [delegationsResources],
  );

  const delegations = useMemo(() => total("userActiveStake"), [total]);
  const unbondings = useMemo(() => total("userUnBondable"), [total]);
  const available = useMemo(() => account.spendableBalance, [account]);

  const items = useMemo(
    () =>
      [
        {
          title: "account.availableBalance",
          show: true,
          value: available,
          modal: {
            Icon: () => <Elrond color={currency.color} size={18} />,
            title: t("elrond.info.available.title"),
            description: t("elrond.info.available.description"),
          },
        },
        {
          title: "account.delegatedAssets",
          show: delegations.gt(0),
          value: delegations,
          modal: {
            title: t("elrond.info.delegated.title"),
            description: t("elrond.info.delegated.description"),
          },
        },
        {
          title: "account.undelegating",
          show: unbondings.gt(0),
          value: unbondings,
          modal: {
            title: t("elrond.info.undelegating.title"),
            description: t("elrond.info.undelegating.description"),
          },
        },
      ].filter(item => item.show),
    [available, delegations, unbondings, t, currency.color],
  );

  useEffect(fetchDelegations, [fetchDelegations]);

  if (delegations.lte(0) && unbondings.lte(0)) {
    return null;
  }

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={[styles.root, { borderTopColor: colors.lightFog }]}
    >
      <InfoModal
        isOpened={data.length > 0}
        onClose={onCloseModal}
        data={data}
      />

      <View>
        {items.map(item => (
          <InfoItem
            key={item.title}
            title={t(item.title)}
            onPress={() => setData([item.modal])}
            value={
              <CurrencyUnitValue
                unit={unit}
                value={item.value}
                disableRounding={true}
              />
            }
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default withSummary(Summary);
