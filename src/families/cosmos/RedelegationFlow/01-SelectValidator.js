// @flow
import invariant from "invariant";
import React, { useCallback, useState, useMemo } from "react";
import { View, StyleSheet, SectionList } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";

import type { Transaction } from "@ledgerhq/live-common/lib/families/cosmos/types";

import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import {
  getMainAccount,
  getAccountUnit,
} from "@ledgerhq/live-common/lib/account";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";

import {
  useCosmosPreloadData,
  useSortedValidators,
} from "@ledgerhq/live-common/lib/families/cosmos/react";

import { accountScreenSelector } from "../../../reducers/accounts";
import colors from "../../../colors";
import { ScreenName } from "../../../const";
import SelectValidatorSearchBox from "../../tron/VoteFlow/01-SelectValidator/SearchBox";
import LText from "../../../components/LText";
import Item from "../shared/Item";

type RouteParams = {
  accountId: string,
  validatorSrcAddress: string,
  transaction: Transaction,
};

type Props = {
  navigation: any,
  route: { params: RouteParams },
};

function RedelegationSelectValidator({ navigation, route }: Props) {
  const { account } = useSelector(accountScreenSelector(route));

  invariant(account, "account required");

  const mainAccount = getMainAccount(account, undefined);
  const bridge = getAccountBridge(account, undefined);

  const { cosmosResources } = mainAccount;

  invariant(cosmosResources, "cosmosResources required");

  const delegations = cosmosResources.delegations;

  const { transaction, status } = useBridgeTransaction(() => {
    const t = bridge.createTransaction(mainAccount);

    return {
      account,
      transaction: bridge.updateTransaction(t, {
        mode: "redelegate",
        validators: [],
        cosmosSourceValidator: route.params?.validatorSrcAddress,
        /** @TODO remove this once the bridge handles it */
        recipient: mainAccount.freshAddress,
      }),
    };
  });

  invariant(
    transaction && transaction.cosmosSourceValidator,
    "transaction src validator required",
  );

  const unit = getAccountUnit(account);

  const [searchQuery, setSearchQuery] = useState("");

  const { validators } = useCosmosPreloadData();

  const validatorSrc = useMemo(
    () =>
      validators.find(
        ({ validatorAddress }) =>
          validatorAddress === transaction.cosmosSourceValidator,
      ),
    [validators, transaction.cosmosSourceValidator],
  );

  const SR = useSortedValidators(searchQuery, validators, []);

  const srcDelegation = useMemo(
    () =>
      delegations.find(
        ({ validatorAddress }) =>
          validatorAddress === transaction.cosmosSourceValidator,
      ),
    [delegations, transaction.cosmosSourceValidator],
  );

  invariant(srcDelegation, "source delegation required");

  const max = srcDelegation.amount;

  const sections = useMemo(
    () =>
      SR.reduce(
        (data, validator) => {
          if (
            validator.validator.validatorAddress ===
            transaction?.cosmosSourceValidator
          )
            return data;

          if (
            delegations.some(
              ({ validatorAddress }) =>
                validatorAddress === validator.validator.validatorAddress,
            )
          )
            data[0].data.push(validator);
          else data[1].data.push(validator);
          return data;
        },
        [
          {
            title: (
              <Trans i18nKey="cosmos.redelegation.flow.steps.validator.myDelegations" />
            ),
            data: [],
          },
          {
            title: (
              <Trans i18nKey="cosmos.redelegation.flow.steps.validator.validators" />
            ),
            data: [],
          },
        ],
      ).filter(({ data }) => data.length > 0),
    [delegations, transaction, SR],
  );

  const onSelect = useCallback(
    (validator, redelegatedBalance) => {
      navigation.navigate(ScreenName.CosmosRedelegationAmount, {
        ...route.params,
        transaction,
        validatorSrc,
        validator,
        max,
        redelegatedBalance,
        status,
        nextScreen: ScreenName.CosmosRedelegationConnectDevice,
      });
    },
    [navigation, route.params, transaction, status, max, validatorSrc],
  );

  const renderItem = useCallback(
    ({ item }) => {
      const val = delegations.find(
        ({ validatorAddress }) =>
          validatorAddress === item.validator.validatorAddress,
      );
      const disabled = (!val || val.amount.lte(0)) && max.lte(0);
      return (
        <Item
          disabled={disabled}
          value={val ? val.amount : null}
          showVal={false}
          unit={unit}
          item={item}
          onSelect={onSelect}
        />
      );
    },
    [delegations, unit, onSelect, max],
  );

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.main}>
        <View style={styles.searchSection}>
          <SelectValidatorSearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </View>
        {sections.length <= 0 && (
          <View style={styles.noResult}>
            <LText>
              <Trans
                i18nKey="cosmos.redelegation.flow.steps.validator.noResultsFound"
                values={{ search: searchQuery }}
              >
                <LText bold>{""}</LText>
              </Trans>
            </LText>
          </View>
        )}
        <SectionList
          style={styles.list}
          sections={sections}
          keyExtractor={(item, index) => item + index}
          renderItem={renderItem}
          renderSectionHeader={({ section: { title } }) => (
            <LText style={styles.header}>{title}</LText>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  searchSection: { height: 55, paddingHorizontal: 16 },
  list: { width: "100%" },
  noResult: {
    flex: 1,
    justifyContent: "flex-end",
  },
  header: {
    width: "100%",
    height: 32,
    paddingHorizontal: 16,
    fontSize: 14,
    lineHeight: 32,
    backgroundColor: colors.lightFog,
    color: colors.grey,
  },
  footer: {
    alignSelf: "stretch",
    padding: 16,
    backgroundColor: colors.white,
  },
  labelContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 16,
  },
  assetsRemaining: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 32,
    paddingHorizontal: 10,
  },
  error: {
    color: colors.alert,
  },
  success: {
    color: colors.success,
  },
});

export default RedelegationSelectValidator;
