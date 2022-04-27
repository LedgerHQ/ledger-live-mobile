import React, { useCallback, useState, useMemo, useEffect } from "react";
import {
  View,
  StyleSheet,
  SectionList,
  Text,
  TouchableOpacity,
} from "react-native";
import { BigNumber } from "bignumber.js";
import SafeAreaView from "react-native-safe-area-view";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";

import type { Transaction } from "@ledgerhq/live-common/lib/families/cosmos/types";

import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import {
  getMainAccount,
  getAccountUnit,
} from "@ledgerhq/live-common/lib/account";
import estimateMaxSpendable from "@ledgerhq/live-common/lib/families/elrond/js-estimateMaxSpendable";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";
import {
  COSMOS_MAX_DELEGATIONS,
  getMaxDelegationAvailable,
} from "@ledgerhq/live-common/lib/families/cosmos/logic";

import {
  useCosmosPreloadData,
  useSortedValidators,
} from "@ledgerhq/live-common/lib/families/cosmos/react";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";

import { useTheme } from "@react-navigation/native";
import { accountScreenSelector } from "../../../../reducers/accounts";
import { localeSelector } from "../../../../reducers/settings";
import { ScreenName } from "../../../../const";
import Button from "../../../../components/Button";
import SelectValidatorSearchBox from "../../../tron/VoteFlow/01-SelectValidator/SearchBox";
import LText from "../../../../components/LText";
import FirstLetterIcon from "../../../../components/FirstLetterIcon";
import CurrencyUnitValue from "../../../../components/CurrencyUnitValue";
import ArrowRight from "../../../../icons/ArrowRight";
import Check from "../../../../icons/Check";

type RouteParams = {
  accountId: string,
  transaction: Transaction,
  fromSelectAmount?: true,
};

type Props = {
  navigation: any,
  route: { params: RouteParams },
};

const styles = StyleSheet.create({
  stack: {
    root: {
      flex: 1,
    },
    noResult: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    header: {
      height: 32,
      paddingHorizontal: 16,
      lineHeight: 32,
      fontSize: 14,
    },
    footer: {
      borderTopWidth: 1,
      padding: 16,
    },
    labelContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    assetsRemaining: {
      fontSize: 16,
      textAlign: "center",
      lineHeight: 32,
      paddingHorizontal: 10,
    },
    small: {
      fontSize: 12,
    },
    textCenter: { textAlign: "center" },
    paddingBottom: {
      paddingBottom: 8,
    },
  },
  item: {
    wrapper: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
    },
    iconWrapper: {
      height: 36,
      width: 36,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 5,

      marginRight: 12,
    },
    nameWrapper: {
      flex: 1,
      paddingRight: 16,
    },
    nameText: {
      fontSize: 15,
    },
    subText: {
      fontSize: 13,
    },
    valueContainer: { alignItems: "flex-end" },
    value: { flexDirection: "row", alignItems: "center" },
    valueLabel: { paddingHorizontal: 8, fontSize: 16 },
  },
});

function DelegationSelectValidator({ navigation, route }: Props) {
  const account = route.params.account;
  const recipient = route.params.recipient;
  const amount = route.params.amount;

  const delegations = useMemo(() => route.params.delegations, [
    route.params.delegations,
  ]);

  const locale = useSelector(localeSelector);
  const mainAccount = getMainAccount(account);
  const bridge = getAccountBridge(account);
  const unit = getAccountUnit(account);

  const { colors } = useTheme();
  const { transaction, status, updateTransaction } = useBridgeTransaction(
    () => {
      const transaction = route.params.transaction;

      if (!transaction) {
        const tx = bridge.createTransaction(mainAccount);

        return {
          account,
          transaction: bridge.updateTransaction(tx, {
            mode: "delegate",
          }),
        };
      }

      return {
        account,
        transaction,
      };
    },
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [max, setMax] = useState(
    account.spendableBalance.minus(transaction.amount),
  );

  const categories = useMemo(
    () => [
      {
        key: "own",
        label: "elrond.delegation.flow.steps.validator.myDelegations",
      },
      {
        key: "other",
        label: "elrond.delegation.flow.steps.validator.validators",
      },
    ],
    [],
  );

  const mapValidators = useCallback(
    (validator, index) => ({
      ...validator,
      index,
      delegations: delegations.reduce(
        (total, delegation) =>
          validator.providers.includes(delegation.contract)
            ? total.plus(delegation.userActiveStake)
            : total,
        BigNumber(0),
      ),
    }),
    [delegations],
  );

  const filterValidators = useCallback(
    validator =>
      validator.name.toLowerCase().includes(searchQuery.toLowerCase()),
    [searchQuery],
  );

  const validators = useMemo(
    () => route.params.validators.map(mapValidators).filter(filterValidators),
    [route.params.validators, mapValidators, filterValidators],
  );

  const sections = useMemo(
    () =>
      categories.reduce((total, category) => {
        const other = category.key === "other";
        const own = category.key === "own";
        const data = [];

        validators.forEach(validator => {
          const inTransaction = validator.providers.includes(
            transaction.recipient,
          );
          const inDelegation = delegations.some(delegation =>
            validator.providers.includes(delegation.contract),
          );
          if (own && (inTransaction || inDelegation)) {
            data.push(validator);
          }
          if (other && !inTransaction && !inDelegation) {
            data.push(validator);
          }
        });

        return [
          ...total,
          {
            title: category.label,
            data,
          },
        ].filter(category => category.data.length > 0);
      }, []),
    [categories, delegations, validators, transaction.recipient],
  );

  useEffect(() => {
    if (!route.params.fromSelectAmount) {
      return;
    }

    updateTransaction(_ => route.params.transaction);
  }, [route.params, updateTransaction]);

  useEffect(() => {
    const fetchEstimation = async () => {
      const estimation = await estimateMaxSpendable({ transaction, account });

      setMax(BigNumber(estimation).minus(transaction.amount));
    };

    if (estimateMaxSpendable) {
      fetchEstimation();
    }

    return () => setMax(account.spendableBalance);
  }, [account, transaction]);

  const onNext = useCallback(() => {
    navigation.navigate(ScreenName.ElrondDelegationSelectDevice, {
      ...route.params,
      transaction,
      status,
    });
  }, [navigation, route.params, transaction, status]);

  const onSelect = useCallback(
    validator => {
      navigation.navigate(ScreenName.ElrondDelegationAmount, {
        ...route.params,
        transaction,
        validator,
        min: null,
        max,
        value: transaction.amount,
        status,
        account,
        nextScreen: ScreenName.ElrondDelegationValidator,
      });
    },
    [navigation, route.params, transaction, status, account, max],
  );

  const renderItem = useCallback(
    props => (
      <Item {...{ ...props, onSelect, unit, delegations, recipient, amount }} />
    ),
    [unit, onSelect, delegations, recipient, amount],
  );

  const error = status && status.errors && Object.values(status.errors)[0];

  return (
    <SafeAreaView
      style={[styles.stack.root, { backgroundColor: colors.background }]}
    >
      <SelectValidatorSearchBox
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {sections.length <= 0 && (
        <View style={styles.stack.noResult}>
          <LText style={styles.stack.textCenter}>
            <Trans
              i18nKey="elrond.delegation.flow.steps.validator.noResultsFound"
              values={{ search: searchQuery }}
            >
              <LText bold>{""}</LText>
            </Trans>
          </LText>
        </View>
      )}

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item + index}
        renderItem={renderItem}
        stickySectionHeadersEnabled={true}
        renderSectionHeader={({ section: { title } }) => (
          <LText
            style={[styles.stack.header, { backgroundColor: colors.lightFog }]}
            color="grey"
          >
            <Trans i18nKey={title} />
          </LText>
        )}
      />

      <View
        style={[
          styles.stack.footer,
          { borderTopColor: colors.lightFog, backgroundColor: colors.card },
        ]}
      >
        <View style={styles.stack.paddingBottom}>
          {max.isZero() && (
            <View style={styles.stack.labelContainer}>
              <Check size={16} color={colors.success} />

              <LText style={[styles.stack.assetsRemaining]} color="success">
                <Trans i18nKey="elrond.delegation.flow.steps.validator.allAssetsUsed" />
              </LText>
            </View>
          )}

          {max.gt(0) && (
            <View style={styles.stack.labelContainer}>
              <LText style={styles.stack.assetsRemaining}>
                <Trans
                  i18nKey="elrond.delegation.flow.steps.validator.totalAvailable"
                  values={{
                    amount: formatCurrencyUnit(unit, max, {
                      showCode: true,
                      locale,
                    }),
                  }}
                >
                  <LText semiBold>{""}</LText>
                </Trans>
              </LText>
            </View>
          )}
        </View>

        <Button
          disabled={!!error}
          event="Elrond DelegationSelectValidatorContinueBtn"
          onPress={onNext}
          title={<Trans i18nKey="elrond.delegation.flow.steps.validator.cta" />}
          type="primary"
        />
      </View>
    </SafeAreaView>
  );
}

const Item = props => {
  const [provider] = props.item.providers;

  const { onSelect, item, unit, recipient, amount } = props;
  const { name, rank, apr, delegations } = item;
  const { colors } = useTheme();

  const value = BigNumber(amount || 0);
  const disabled = recipient !== provider && value.gt(0);

  return (
    <TouchableOpacity
      onPress={() => onSelect(provider, delegations)}
      style={[styles.item.wrapper]}
      disabled={disabled}
    >
      <View
        style={[styles.item.iconWrapper, { backgroundColor: colors.lightLive }]}
      >
        <FirstLetterIcon
          style={disabled ? { backgroundColor: colors.lightFog } : {}}
          label={name || provider}
        />
      </View>

      <View style={styles.item.nameWrapper}>
        <LText semiBold={true} style={[styles.item.nameText]} numberOfLines={1}>
          {rank}. {name || provider}
        </LText>

        {apr && (
          <LText style={styles.item.subText} color="grey" numberOfLines={1}>
            <Trans
              i18nKey="elrond.delegation.flow.steps.validator.estYield"
              values={{
                amount: apr,
              }}
            />
          </LText>
        )}
      </View>

      <View style={styles.item.value}>
        <View style={styles.item.valueContainer}>
          <LText
            semiBold={true}
            style={[styles.item.valueLabel]}
            color={disabled ? "grey" : "darkBlue"}
          >
            {value.gt(0) && provider === recipient ? (
              <CurrencyUnitValue {...{ unit, value, showCode: false }} />
            ) : (
              "0"
            )}
          </LText>

          {delegations && delegations.gt(0) && (
            <LText
              style={[styles.valueLabel, styles.subText]}
              color="grey"
              numberOfLines={1}
            >
              <Trans i18nKey="elrond.delegation.flow.steps.validator.currentAmount">
                <CurrencyUnitValue
                  value={delegations}
                  unit={unit}
                  showCode={false}
                />
              </Trans>
            </LText>
          )}
        </View>

        <ArrowRight size={16} color={colors.grey} />
      </View>
    </TouchableOpacity>
  );
};

export default DelegationSelectValidator;
