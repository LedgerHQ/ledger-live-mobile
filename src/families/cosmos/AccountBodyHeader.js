// @flow
import React, { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import Button from "../../components/Button";
import { NavigatorName, ScreenName } from "../../const";

export default function DelegationFlow({ account }: Props) {
  const navigation = useNavigation();

  const onPress = useCallback(
    () =>
      navigation.navigate(NavigatorName.CosmosDelegationFlow, {
        screen: ScreenName.CosmosDelegationStarted,
        params: { accountId: account.id },
      }),
    [navigation, account],
  );

  if (!account || !account.cosmosResources) return null;

  return (
    <Button event="" type="primary" title="delegation flow" onPress={onPress} />
  );
}
