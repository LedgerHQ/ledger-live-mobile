// @flow
import React, { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { useCosmosMappedDelegations } from "@ledgerhq/live-common/lib/families/cosmos/react";
import Button from "../../components/Button";
import { NavigatorName, ScreenName } from "../../const";

export default function DelegationFlow({ account }: Props) {
  const navigation = useNavigation();

  const delegations = useCosmosMappedDelegations(account);

  const onDelegate = useCallback(
    () =>
      navigation.navigate(NavigatorName.CosmosDelegationFlow, {
        screen: ScreenName.CosmosDelegationStarted,
        params: { accountId: account.id },
      }),
    [navigation, account],
  );

  const onRedelegate = useCallback(
    () =>
      navigation.navigate(NavigatorName.CosmosRedelegationFlow, {
        screen: ScreenName.CosmosRedelegationValidator,
        params: {
          accountId: account.id,
          validatorSrcAddress:
            account.cosmosResources.delegations[0].validatorAddress,
        },
      }),
    [navigation, account],
  );

  const onUndelegate = useCallback(() => {
    navigation.navigate(NavigatorName.CosmosUndelegationFlow, {
      screen: ScreenName.CosmosUndelegationAmount,
      params: {
        accountId: account.id,
        delegation: delegations[0],
      },
    });
  }, [navigation, account, delegations]);

  if (!account || !account.cosmosResources) return null;

  return (
    <>
      <Button
        event=""
        type="primary"
        title="delegation flow"
        onPress={onDelegate}
      />
      <Button
        event=""
        type="primary"
        title="redelegation flow"
        onPress={onRedelegate}
      />
      <Button
        event=""
        type="primary"
        title="undelegation flow"
        onPress={onUndelegate}
      />
    </>
  );
}
