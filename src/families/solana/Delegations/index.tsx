import {
  getAccountCurrency,
  getAccountUnit,
  getMainAccount,
} from "@ledgerhq/live-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import {
  getAddressExplorer,
  getDefaultExplorerView,
} from "@ledgerhq/live-common/lib/explorers";
import {
  stakeActions,
  stakeActivePercent,
} from "@ledgerhq/live-common/lib/families/solana/logic";
import { useSolanaStakesWithMeta } from "@ledgerhq/live-common/lib/families/solana/react";
import {
  SolanaStakeWithMeta,
  StakeAction,
} from "@ledgerhq/live-common/lib/families/solana/types";
import {
  assertUnreachable,
  tupleOfUnion,
} from "@ledgerhq/live-common/lib/families/solana/utils";
import { Account } from "@ledgerhq/live-common/lib/types";
import { Text } from "@ledgerhq/native-ui";
import { useNavigation, useTheme } from "@react-navigation/native";
import { BigNumber } from "bignumber.js";
import invariant from "invariant";
import { capitalize } from "lodash/fp";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Linking, StyleSheet, View } from "react-native";
import AccountDelegationInfo from "../../../components/AccountDelegationInfo";
import AccountSectionLabel from "../../../components/AccountSectionLabel";
import Circle from "../../../components/Circle";
import DelegationDrawer, {
  IconProps,
} from "../../../components/DelegationDrawer";
import Touchable from "../../../components/Touchable";
import { urls } from "../../../config/urls";
import { NavigatorName, ScreenName } from "../../../const";
import IlluRewards from "../../../icons/images/Rewards";
import DelegateIcon from "../../../icons/Delegate";
import UndelegateIcon from "../../../icons/Undelegate";
import WalletIcon from "../../../icons/Wallet";
import ValidatorImage from "../shared/ValidatorImage";
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

  const formatAmount = (amount: number) => {
    return formatCurrencyUnit(unit, new BigNumber(amount), {
      disableRounding: true,
      alwaysShowSign: false,
      showCode: true,
    });
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
      {
        label: "Active",
        Component: (
          <Text
            numberOfLines={1}
            fontWeight="semiBold"
            ellipsizeMode="middle"
            style={[styles.valueText]}
            color="live"
          >
            {stake.delegation === undefined
              ? 0
              : stakeActivePercent(stake).toFixed(2)}{" "}
            %
          </Text>
        ),
      },
      {
        label: "Available balance",
        Component: (
          <Text
            numberOfLines={1}
            fontWeight="semiBold"
            ellipsizeMode="middle"
            style={[styles.valueText]}
            color="live"
          >
            {formatAmount(stake.withdrawable)}
          </Text>
        ),
      },
    ];
  }, [selectedStakeWithMeta, t, account]);

  const delegationActions = useMemo<DelegationDrawerActions>(() => {
    const allStakeActions = tupleOfUnion<StakeAction>()([
      "activate",
      "deactivate",
      "reactivate",
      "withdraw",
    ]);

    const availableActions =
      (selectedStakeWithMeta && stakeActions(selectedStakeWithMeta.stake)) ??
      [];

    return allStakeActions.map(action => {
      const drawerAction: DelegationDrawerActions[number] = {
        label: capitalize(action),
        Icon: (props: IconProps) => (
          <Circle {...props}>
            <DrawerStakeActionIcon
              stakeAction={action}
              color={availableActions.includes(action) ? undefined : "grey"}
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
        disabled: !availableActions.includes(action),
      };
      return drawerAction;
    });
  }, [t, selectedStakeWithMeta, account, onNavigate]);

  return (
    <View style={styles.root}>
      <DelegationDrawer
        isOpen={data && data.length > 0}
        onClose={onCloseDrawer}
        account={account}
        ValidatorImage={({ size }) => (
          <ValidatorImage
            imgUrl={selectedStakeWithMeta?.meta?.validator?.img}
            size={size}
          />
        )}
        amount={
          new BigNumber(selectedStakeWithMeta?.stake?.delegation?.stake ?? 0)
        }
        data={data}
        actions={delegationActions}
      />

      {stakesWithMeta.length === 0 ? (
        <AccountDelegationInfo
          title={t("account.delegation.info.title")}
          image={<IlluRewards style={styles.illustration} />}
          description={t("cosmos.delegation.delegationEarn", {
            name: account.currency.name,
          })}
          infoUrl={urls.cosmosStaking}
          infoTitle={t("cosmos.delegation.info")}
          onPress={() => {}}
          ctaTitle={t("account.delegation.info.cta")}
        />
      ) : (
        <View style={styles.wrapper}>
          {stakesWithMeta.map((stakeWithMeta, i) => (
            <View
              key={stakeWithMeta.stake.stakeAccAddr}
              style={[
                styles.delegationsWrapper,
                { backgroundColor: colors.card },
              ]}
            >
              <DelegationRow
                stakeWithMeta={stakeWithMeta}
                currency={currency}
                unit={unit}
                onPress={() => setSelectedStakeWithMeta(stakeWithMeta)}
                isLast={i === stakesWithMeta.length - 1}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function DrawerStakeActionIcon({
  color,
  stakeAction,
}: {
  color?: string;
  stakeAction: StakeAction;
}) {
  switch (stakeAction) {
    case "activate":
    case "reactivate":
      return <DelegateIcon color={color} />;
    case "deactivate":
      return <UndelegateIcon color={color} />;
    case "withdraw":
      return <UndelegateIcon color={color} />;
    default:
      return assertUnreachable(stakeAction);
  }
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
