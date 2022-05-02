import {
  getAccountCurrency,
  getAccountUnit,
  getMainAccount,
} from "@ledgerhq/live-common/lib/account";
import {
  getAddressExplorer,
  getDefaultExplorerView,
} from "@ledgerhq/live-common/lib/explorers";
import invariant from "invariant";
import { stakeActions } from "@ledgerhq/live-common/lib/families/solana/logic";
import { useSolanaStakesWithMeta } from "@ledgerhq/live-common/lib/families/solana/react";
import { SolanaStakeWithMeta } from "@ledgerhq/live-common/lib/families/solana/types";
import { Account } from "@ledgerhq/live-common/lib/types";
import { Text } from "@ledgerhq/native-ui";
import { useNavigation, useTheme } from "@react-navigation/native";
import { BigNumber } from "bignumber.js";
import { capitalize } from "lodash/fp";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Linking, StyleSheet, View } from "react-native";
import AccountDelegationInfo from "../../../components/AccountDelegationInfo";
import AccountSectionLabel from "../../../components/AccountSectionLabel";
import Button from "../../../components/Button";
import Circle from "../../../components/Circle";
import CounterValue from "../../../components/CounterValue";
import CurrencyUnitValue from "../../../components/CurrencyUnitValue";
import { IconProps } from "../../../components/DelegationDrawer";
import DelegationDrawer from "../../../components/DelegationDrawer";
import FirstLetterIcon from "../../../components/FirstLetterIcon";
import Touchable from "../../../components/Touchable";
import { urls } from "../../../config/urls";
import { NavigatorName, ScreenName } from "../../../const";
import IlluRewards from "../../../icons/images/Rewards";
import RedelegateIcon from "../../../icons/Redelegate";
import DelegationLabelRight from "./LabelRight";
import DelegationRow from "./Row";

type Props = {
  account: Account;
};

type DelegationDrawerProps = Parameters<typeof DelegationDrawer>[0];
type DelegationDrawerActions = DelegationDrawerProps["actions"];

function Delegations({ account }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const mainAccount = getMainAccount(account, undefined);
  const currency = getAccountCurrency(mainAccount);

  invariant(currency.type === "CryptoCurrency", "expected crypto currency");

  const stakesWithMeta: SolanaStakeWithMeta[] = useSolanaStakesWithMeta(
    currency,
    mainAccount.solanaResources?.stakes ?? [],
  );

  const unit = getAccountUnit(mainAccount);
  const navigation: any = useNavigation();

  const [selectedStakeWithMeta, setSelectedStakeWithMeta] = useState<
    SolanaStakeWithMeta | undefined
  >();

  const totalRewardsAvailable = new BigNumber(0);

  const onNavigate: any = ({
    route,
    screen,
    params,
  }: {
    route: keyof typeof NavigatorName | keyof typeof ScreenName;
    screen?: keyof typeof ScreenName;
    params?: { [key: string]: any };
  }) => {
    setSelectedStakeWithMeta(undefined);
    navigation.navigate(route, {
      screen,
      params: { ...params, accountId: account.id },
    });
  };

  const onDelegate = () => {
    onNavigate({
      route: NavigatorName.SolanaDelegationFlow,
      screen: ScreenName.DelegationSummary,
      params: {
        delegationAction: {
          kind: "new",
        },
      },
    });
  };

  const onCloseDrawer = () => {
    setSelectedStakeWithMeta(undefined);
  };

  const openValidatorUrl = ({ stake, meta }: SolanaStakeWithMeta) => {
    const { delegation } = stake;
    const url =
      meta.validator?.url ??
      (delegation?.voteAccAddr &&
        getAddressExplorer(
          getDefaultExplorerView(account.currency),
          delegation.voteAccAddr,
        ));
    if (url) {
      Linking.openURL(url);
    }
  };

  const data = useMemo<DelegationDrawerProps["data"]>(() => {
    if (selectedStakeWithMeta === undefined) {
      return [];
    }

    const { stake, meta } = selectedStakeWithMeta;

    return [
      {
        label: t("delegation.validator"),
        Component: (
          <Touchable
            onPress={() => openValidatorUrl(selectedStakeWithMeta)}
            event="DelegationOpenExplorer"
          >
            <Text
              numberOfLines={1}
              fontWeight="semiBold"
              ellipsizeMode="middle"
              style={[styles.valueText]}
              color="live"
            >
              {meta.validator?.name ?? stake.delegation?.voteAccAddr ?? "N/A"}
            </Text>
          </Touchable>
        ),
      },
      {
        label: t("cosmos.delegation.drawer.status"),
        Component: (
          <Text
            numberOfLines={1}
            fontWeight="semiBold"
            ellipsizeMode="middle"
            style={[styles.valueText]}
            color="live"
          >
            {stake.activation.state}
          </Text>
        ),
      },
    ];
  }, [selectedStakeWithMeta, t, account]);

  const delegationActions = useMemo<DelegationDrawerActions>(() => {
    const actions =
      (selectedStakeWithMeta && stakeActions(selectedStakeWithMeta.stake)) ??
      [];

    return actions.map(action => {
      const drawerAction: DelegationDrawerActions[number] = {
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
                stakeWithMeta: selectedStakeWithMeta,
                stakeAction: action,
              },
            },
          });
        },
      };
      return drawerAction;
    });
  }, [t, selectedStakeWithMeta, account, onNavigate]);

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
        amount={
          new BigNumber(selectedStakeWithMeta?.stake?.delegation?.stake ?? 0)
        }
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
              <Text fontWeight="semiBold" style={styles.label}>
                <CurrencyUnitValue value={totalRewardsAvailable} unit={unit} />
              </Text>
              <Text fontWeight="semiBold" style={styles.subLabel} color="grey">
                <CounterValue
                  currency={currency}
                  value={totalRewardsAvailable}
                  withPlaceholder
                />
              </Text>
            </View>
            <Button
              event="Cosmos AccountClaimRewardsBtn Click"
              onPress={() => {}}
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
                onPress={() => setSelectedStakeWithMeta(d)}
                isLast={i === stakesWithMeta.length - 1}
              />
            </View>
          ))}
        </View>
      )}
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
