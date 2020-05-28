// @flow
import { BigNumber } from "bignumber.js";
import React, { useCallback, useState, useMemo } from "react";
import type { ElementProps } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import { useCosmosMappedDelegations } from "@ledgerhq/live-common/lib/families/cosmos/react";
import type { CosmosMappedDelegation } from "@ledgerhq/live-common/lib/families/cosmos/types";
import type { Account } from "@ledgerhq/live-common/lib/types";
import { TouchableOpacity } from "react-native-gesture-handler";
import DelegationInfo from "../../../components/DelegationInfo";
import IlluRewards from "../../../components/IlluRewards";
import { urls } from "../../../config/urls";
import AccountSectionLabel from "../../../components/AccountSectionLabel";
import DelegationDrawer, {
  styles as drawerStyles,
} from "../../../components/DelegationDrawer";
import type { IconProps } from "../../../components/DelegationDrawer";
import colors, { rgba } from "../../../colors";
import { ScreenName, NavigatorName } from "../../../const";
import DelegationRow from "./Row";
import DelegationLabelRight from "./LabelRight";
import Circle from "../../../components/Circle";
import LText from "../../../components/LText";
import DelegateIcon from "../../../icons/Delegate";
import RedelegateIcon from "../../../icons/Redelegate";
import UndelegateIcon from "../../../icons/Undelegate";
import ClaimRewardIcon from "../../../icons/ClaimReward";

type Props = {
  account: Account,
};

type DelegationDrawerProps = ElementProps<typeof DelegationDrawer>;
type DelegationDrawerActions = $PropertyType<DelegationDrawerProps, "actions">;

export default function Deleagations({ account }: Props) {
  const { t } = useTranslation();
  const delegations = useCosmosMappedDelegations(account);
  const currency = getAccountCurrency(account);
  const navigation = useNavigation();

  const [delegation, setDelegation] = useState<?CosmosMappedDelegation>();

  const data = useMemo<$PropertyType<DelegationDrawerProps, "data">>(
    () =>
      delegation
        ? [
            {
              label: t("delegation.validator"),
              Component:
                delegation.validator?.name ?? delegation.validatorAddress ?? "",
            },
            {
              label: t("delegation.validatorAddress"),
              Component: () => {
                return (
                  // TODO link to explorer
                  <TouchableOpacity onPress={() => {}}>
                    <LText
                      numberOfLines={1}
                      semiBold
                      ellipsizeMode="middle"
                      style={[
                        drawerStyles.valueText,
                        drawerStyles.valueTextTouchable,
                      ]}
                    >
                      {delegation.validatorAddress}
                    </LText>
                  </TouchableOpacity>
                );
              },
            },
            {
              label: t("delegation.delegatedAccount"),
              Component: account.name,
            },
            {
              label: t("cosmos.delegation.drawer.status"),
              Component:
                delegation.status === "bonded"
                  ? t("cosmos.delegation.drawer.active")
                  : t("cosmos.delegation.drawer.inactive"),
            },
            {
              label: t("cosmos.delegation.drawer.rewards"),
              Component: delegation.formattedAmount ?? "",
            },
          ]
        : [],
    [delegation, t, account],
  );

  const onDelegate = useCallback(() => {
    // TODO: check destination and params.
    // TODO: check whether onDelegate and onAddDelegation are the same or not
    navigation.navigate(NavigatorName.CosmosDelegationFlow, {
      screen: ScreenName.DelegationSelectValidator,
      params: {
        account,
      },
    });
  }, [navigation, account]);

  const onRedelegate = useCallback(() => {
    // TODO: check destination and params.
    navigation.navigate(NavigatorName.CosmosRedelegationFlow);
  }, [navigation]);

  const onCollectRewards = useCallback(() => {
    // TODO: check destination and params.
    navigation.navigate(NavigatorName.CosmosCollectRewardsFlow);
  }, [navigation]);

  const onUndelegate = useCallback(() => {
    // TODO: check destination and params.
    navigation.navigate(NavigatorName.CosmosUndelegationFlow);
  }, [navigation]);

  const onSeeMore = useCallback((delegation: CosmosMappedDelegation) => {
    setDelegation(delegation);
  }, []);

  const onCloseDrawer = useCallback(() => {
    setDelegation();
  }, []);

  const actions = useMemo<DelegationDrawerActions>(
    () => [
      {
        label: t("delegation.actions.delegate"),
        Icon: (props: IconProps) => (
          <Circle {...props} bg={colors.fog}>
            <DelegateIcon />
          </Circle>
        ),
        onPress: onDelegate,
        event: "DelegationActionDelegate",
      },
      {
        label: t("delegation.actions.redelegate"),
        Icon: (props: IconProps) => (
          <Circle {...props} bg={colors.fog}>
            <RedelegateIcon />
          </Circle>
        ),
        onPress: onRedelegate,
        event: "DelegationActionRedelegate",
      },
      {
        label: t("delegation.actions.collectRewards"),
        Icon: (props: IconProps) => (
          <Circle {...props} bg={rgba(colors.yellow, 0.2)}>
            <ClaimRewardIcon />
          </Circle>
        ),
        onPress: onCollectRewards,
        event: "DelegationActionCollectRewards",
      },
      {
        label: t("delegation.actions.undelegate"),
        Icon: (props: IconProps) => (
          <Circle {...props} bg={rgba(colors.alert, 0.2)}>
            <UndelegateIcon />
          </Circle>
        ),
        onPress: onUndelegate,
        event: "DelegationActionUndelegate",
      },
    ],
    [t, onDelegate, onRedelegate, onCollectRewards, onUndelegate],
  );

  return (
    <View style={styles.root}>
      <DelegationDrawer
        isOpen={!!delegation}
        onClose={onCloseDrawer}
        account={account}
        ValidatorImage={({ size }) => (
          <Circle crop size={size}>
            {/* TODO use FirstLetterIcon */}
            <LText style={{ color: colors.white }}>TODO</LText>
          </Circle>
        )}
        // TODO Check CosmosMappedDelegation type
        amount={delegation?.amount ?? BigNumber(0)}
        data={data}
        actions={actions}
      />

      {delegations.length === 0 ? (
        <DelegationInfo
          title={t("account.delegation.info.title")}
          image={<IlluRewards style={styles.illustration} />}
          description={t("tron.voting.delegationEarn", {
            name: account.currency.name,
          })}
          infoUrl={urls.tronStaking}
          infoTitle={t("tron.voting.howItWorks")}
          onPress={onDelegate}
          ctaTitle={t("account.delegation.info.cta")}
        />
      ) : (
        <>
          <AccountSectionLabel
            name={t("account.delegation.sectionLabel")}
            RightComponent={() => <DelegationLabelRight onPress={onDelegate} />}
          />
          {delegations.map((d, i) => (
            <View style={styles.delegationsWrapper}>
              <DelegationRow
                delegation={d}
                currency={currency}
                onPress={() => onSeeMore(d)}
                isLast={i === delegations.length - 1}
              />
            </View>
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    margin: 16,
  },
  illustration: { alignSelf: "center", marginBottom: 16 },
  delegationsWrapper: {
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  actionColor: {
    color: colors.live,
  },
});
