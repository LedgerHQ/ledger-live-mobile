// @flow
import { BigNumber } from "bignumber.js";
import React, { useCallback, useState, useMemo } from "react";
import type { ElementProps } from "react";
import { View, StyleSheet, Linking } from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
  getAccountCurrency,
  getAccountUnit,
  getMainAccount,
} from "@ledgerhq/live-common/lib/account";
import {
  getDefaultExplorerView,
  getAddressExplorer,
} from "@ledgerhq/live-common/lib/explorers";
import {
  useSolanaPreloadData,
  useSolanaStakesWithMeta,
} from "@ledgerhq/live-common/lib/families/solana/react";
import { stakeActions } from "@ledgerhq/live-common/lib/families/solana/logic";
import type { SolanaStakeWithMeta } from "@ledgerhq/live-common/lib/families/solana/types";
import type { Account } from "@ledgerhq/live-common/lib/types";
import {} from "@ledgerhq/live-common/lib/families/cosmos/logic";
import AccountDelegationInfo from "../../../components/AccountDelegationInfo";
import IlluRewards from "../../../icons/images/Rewards";
import { urls } from "../../../config/urls";
import AccountSectionLabel from "../../../components/AccountSectionLabel";
import DelegationDrawer from "../../../components/DelegationDrawer";
import type { IconProps } from "../../../components/DelegationDrawer";
import Touchable from "../../../components/Touchable";
import { rgba } from "../../../colors";
import { ScreenName, NavigatorName } from "../../../const";
import Circle from "../../../components/Circle";
import LText from "../../../components/LText";
import Button from "../../../components/Button";
import FirstLetterIcon from "../../../components/FirstLetterIcon";
import RedelegateIcon from "../../../icons/Redelegate";
import UndelegateIcon from "../../../icons/Undelegate";
import ClaimRewardIcon from "../../../icons/ClaimReward";
import DelegationRow from "./Row";
import DelegationLabelRight from "./LabelRight";
import CurrencyUnitValue from "../../../components/CurrencyUnitValue";
import CounterValue from "../../../components/CounterValue";
import DateFromNow from "../../../components/DateFromNow";
import { capitalize } from "lodash/fp";

type Props = {
  account: Account,
};

type DelegationDrawerProps = ElementProps<typeof DelegationDrawer>;
type DelegationDrawerActions = $PropertyType<DelegationDrawerProps, "actions">;

function Delegations({ account }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const mainAccount = getMainAccount(account);
  const currency = getAccountCurrency(mainAccount);

  const stakesWithMeta: SolanaStakeWithMeta[] = useSolanaStakesWithMeta(
    currency,
    mainAccount.solanaResources?.stakes ?? [],
  );

  const unit = getAccountUnit(mainAccount);
  const navigation = useNavigation();

  //const { validators } = useSolana();

  //const { cosmosResources } = mainAccount;

  /*
  const undelegations =
    cosmosResources &&
    cosmosResources.unbondings &&
    mapUnbondings(cosmosResources.unbondings, validators, unit);
  */

  const [delegation, setDelegation] = useState<?SolanaStakeWithMeta>();
  //const [undelegation, setUndelegation] = useState<?CosmosMappedUnbonding>();

  /*
  const totalRewardsAvailable = delegations.reduce(
    (sum, d) => sum.plus(d.pendingRewards || 0),
    BigNumber(0),
  );
  */
  const totalRewardsAvailable = new BigNumber(0);

  const onNavigate = useCallback(
    ({
      route,
      screen,
      params,
    }: {
      route: $Values<typeof NavigatorName> | $Values<typeof ScreenName>,
      screen?: $Values<typeof ScreenName>,
      params?: { [key: string]: any },
    }) => {
      setDelegation();
      navigation.navigate(route, {
        screen,
        params: { ...params, accountId: account.id },
      });
    },
    [navigation, account.id],
  );

  const onDelegate = useCallback(() => {
    onNavigate({
      route: NavigatorName.SolanaDelegationFlow,
      screen: ScreenName.DelegationSummary,
      params: {
        delegationAction: {
          kind: "new",
        },
      },
    });
  }, [onNavigate]);

  const onRedelegate = useCallback(() => {
    onNavigate({
      route: NavigatorName.CosmosRedelegationFlow,
      screen: ScreenName.CosmosRedelegationValidator,
      params: {
        accountId: account.id,
        validatorSrcAddress: delegation?.validatorAddress,
      },
    });
  }, [onNavigate, delegation, account]);

  const onCollectRewards = useCallback(() => {
    onNavigate({
      route: NavigatorName.CosmosClaimRewardsFlow,
      screen: delegation
        ? ScreenName.CosmosClaimRewardsMethod
        : ScreenName.CosmosClaimRewardsValidator,
      params: delegation
        ? {
            validator: delegation.validator,
            value: delegation.pendingRewards,
          }
        : {},
    });
  }, [onNavigate, delegation]);

  const onUndelegate = useCallback(() => {
    onNavigate({
      route: NavigatorName.CosmosUndelegationFlow,
      screen: ScreenName.CosmosUndelegationAmount,
      params: {
        accountId: account.id,
        delegation,
      },
    });
  }, [onNavigate, delegation, account]);

  const onCloseDrawer = useCallback(() => {
    setDelegation();
    //setUndelegation();
  }, []);

  const onOpenExplorer = useCallback(
    (address: string) => {
      const url = getAddressExplorer(
        getDefaultExplorerView(account.currency),
        address,
      );
      if (url) Linking.openURL(url);
    },
    [account.currency],
  );

  const data = useMemo<$PropertyType<DelegationDrawerProps, "data">>(() => {
    //const d = delegation || undelegation;
    const d: SolanaStakeWithMeta = delegation;
    //console.log("d is", d);
    if (!d) {
      return [];
    }

    //console.log(d.stake.stakeAccAddr);

    //const redelegation = delegation && getRedelegation(account, delegation);
    const redelegation = null;

    return d
      ? [
          {
            label: t("delegation.validator"),
            Component: (
              <LText
                numberOfLines={1}
                semiBold
                ellipsizeMode="middle"
                style={[styles.valueText]}
                color="live"
              >
                {d.validator?.name ?? d.validatorAddress ?? ""}
              </LText>
            ),
          },
          {
            label: t("delegation.validatorAddress"),
            Component: (
              <Touchable
                onPress={() => onOpenExplorer(d.validatorAddress)}
                event="DelegationOpenExplorer"
              >
                <LText
                  numberOfLines={1}
                  semiBold
                  ellipsizeMode="middle"
                  style={[styles.valueText]}
                  color="live"
                >
                  {d.validatorAddress}
                </LText>
              </Touchable>
            ),
          },
          {
            label: t("delegation.delegatedAccount"),
            Component: (
              <LText
                numberOfLines={1}
                semiBold
                ellipsizeMode="middle"
                style={[styles.valueText]}
                color="live"
              >
                {account.name}{" "}
              </LText>
            ),
          },
          {
            label: t("cosmos.delegation.drawer.status"),
            Component: (
              <LText
                numberOfLines={1}
                semiBold
                ellipsizeMode="middle"
                style={[styles.valueText]}
                color="live"
              >
                {d.status === "bonded"
                  ? t("cosmos.delegation.drawer.active")
                  : t("cosmos.delegation.drawer.inactive")}
              </LText>
            ),
          },
          ...(delegation
            ? [
                {
                  label: t("cosmos.delegation.drawer.rewards"),
                  Component: (
                    <LText
                      numberOfLines={1}
                      semiBold
                      style={[styles.valueText]}
                    >
                      {delegation.stake.stakeAccAddr}
                    </LText>
                  ),
                },
              ]
            : []),
          /*
          ...(undelegation
            ? [
                {
                  label: t("cosmos.delegation.drawer.completionDate"),
                  Component: (
                    <LText numberOfLines={1} semiBold>
                      <DateFromNow
                        date={new Date(undelegation.completionDate).getTime()}
                      />
                    </LText>
                  ),
                },
              ]
            : []),
        */
          ...(redelegation
            ? [
                {
                  label: t("cosmos.delegation.drawer.redelegatedFrom"),
                  Component: (
                    <Touchable
                      onPress={() =>
                        onOpenExplorer(redelegation.validatorSrcAddress)
                      }
                      event="DelegationOpenExplorer"
                    >
                      <LText
                        numberOfLines={1}
                        semiBold
                        ellipsizeMode="middle"
                        style={[styles.valueText]}
                        color="live"
                      >
                        {redelegation.validatorSrcAddress}
                      </LText>
                    </Touchable>
                  ),
                },
                {
                  label: t("cosmos.delegation.drawer.completionDate"),
                  Component: (
                    <LText numberOfLines={1} semiBold>
                      <DateFromNow
                        date={new Date(redelegation.completionDate).getTime()}
                      />
                    </LText>
                  ),
                },
              ]
            : []),
        ]
      : [];
  }, [delegation, t, account, onOpenExplorer /* undelegation */]);

  const delegationActions = useMemo<DelegationDrawerActions>(() => {
    const actions = (delegation && stakeActions(delegation.stake)) ?? [];

    return actions.map(action => {
      const drawerAction: $ElementType<DelegationDrawerActions, number> = {
        label: capitalize(action),
        Icon: (props: IconProps) => (
          <Circle {...props}>
            <RedelegateIcon
            //color={!redelegateEnabled ? colors.grey : undefined}
            />
          </Circle>
        ),
        event: `DelegationAction${capitalize(action)}`,
        onPress: () => {
          onNavigate({
            route: NavigatorName.SolanaDelegationFlow,
            screen: ScreenName.DelegationSummary,
            params: {
              delegationAction: {
                kind: "change",
                stakeWithMeta: delegation,
                stakeAction: action,
              },
            },
          });
        },
      };
      return drawerAction;
    });
  }, [t, delegation, account, onNavigate]);

  //const delegationDisabled = delegations.length <= 0 || !canDelegate(account);
  const delegationDisabled = false;

  return (
    <View style={styles.root}>
      <DelegationDrawer
        isOpen={data && data.length > 0}
        onClose={onCloseDrawer}
        account={account}
        ValidatorImage={({ size }) => (
          <FirstLetterIcon
            label={
              //(delegation || undelegation)?.validator?.name ??
              //(delegation || undelegation)?.validatorAddress ??
              "some laber here"
            }
            round
            size={size}
            fontSize={24}
          />
        )}
        amount={delegation?.amount ?? BigNumber(0)}
        data={data}
        actions={delegationActions}
      />
      {totalRewardsAvailable.gt(0) && (
        <>
          <AccountSectionLabel name={t("account.claimReward.sectionLabel")} />
          <View
            style={[styles.rewardsWrapper, { backgroundColor: colors.card }]}
          >
            <View style={styles.column}>
              <LText semiBold style={styles.label}>
                <CurrencyUnitValue value={totalRewardsAvailable} unit={unit} />
              </LText>
              <LText semiBold style={styles.subLabel} color="grey">
                <CounterValue
                  currency={currency}
                  value={totalRewardsAvailable}
                  withPlaceholder
                />
              </LText>
            </View>
            <Button
              event="Cosmos AccountClaimRewardsBtn Click"
              onPress={onCollectRewards}
              type="primary"
              title={t("account.claimReward.cta")}
            />
          </View>
        </>
      )}

      {stakesWithMeta.length === 0 ? (
        <AccountDelegationInfo
          title={t("account.delegation.info.title")}
          image={<IlluRewards style={styles.illustration} />}
          description={t("cosmos.delegation.delegationEarn", {
            name: account.currency.name,
          })}
          infoUrl={urls.cosmosStaking}
          infoTitle={t("cosmos.delegation.info")}
          onPress={onDelegate}
          ctaTitle={t("account.delegation.info.cta")}
        />
      ) : (
        <View style={styles.wrapper}>
          <AccountSectionLabel
            name={t("account.delegation.sectionLabel")}
            RightComponent={
              <DelegationLabelRight
                disabled={delegationDisabled}
                onPress={onDelegate}
              />
            }
          />
          {stakesWithMeta.map((d, i) => (
            <View
              key={d.stake.stakeAccAddr}
              style={[
                styles.delegationsWrapper,
                { backgroundColor: colors.card },
              ]}
            >
              <DelegationRow
                stakeWithMeta={d}
                currency={currency}
                unit={unit}
                onPress={() => setDelegation(d)}
                isLast={i === stakesWithMeta.length - 1}
              />
            </View>
          ))}
        </View>
      )}

      {/*undelegations && undelegations.length > 0 && (
        <View style={styles.wrapper}>
          <AccountSectionLabel name={t("account.undelegation.sectionLabel")} />
          {undelegations.map((d, i) => (
            <View
              key={d.validatorAddress}
              style={[
                styles.delegationsWrapper,
                { backgroundColor: colors.card },
              ]}
            >
              <DelegationRow
                delegation={d}
                currency={currency}
                onPress={() => setUndelegation(d)}
                isLast={i === undelegations.length - 1}
              />
            </View>
          ))}
        </View>
            )*/}
    </View>
  );
}

export default function SolanaDelegations({ account }: Props) {
  if (!account.solanaResources) return null;
  return <Delegations account={account} />;
}

const styles = StyleSheet.create({
  root: {
    margin: 16,
  },
  illustration: { alignSelf: "center", marginBottom: 16 },
  rewardsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    padding: 16,
    marginBottom: 16,

    borderRadius: 4,
  },
  label: {
    fontSize: 20,
    flex: 1,
  },
  subLabel: {
    fontSize: 14,

    flex: 1,
  },
  column: {
    flexDirection: "column",
  },
  wrapper: {
    marginBottom: 16,
  },
  delegationsWrapper: {
    borderRadius: 4,
  },
  valueText: {
    fontSize: 14,
  },
});
