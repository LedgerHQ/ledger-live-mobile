/* @flow */
import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import type { Operation } from "@ledgerhq/live-common/lib/types";
import { accountScreenSelector } from "../../reducers/accounts";
import { TrackScreen } from "../../analytics";
import colors from "../../colors";
import { ScreenName, NavigatorName } from "../../const";
import PreventNativeBack from "../../components/PreventNativeBack";
import ValidateSuccess from "../../components/ValidateSuccess";
import {
  context as _wcContext,
  setCurrentCallRequestResult,
} from "../WalletConnect/Provider";
import { context as _ptContext, completeStep } from "../ProductTour/Provider";
import { navigate } from "../../rootnavigation";
import ProductTourStepFinishedBottomModal from "../ProductTour/ProductTourStepFinishedBottomModal";

type Props = {
  navigation: any,
  route: { params: RouteParams },
};

type RouteParams = {
  accountId: string,
  deviceId: string,
  transaction: any,
  result: Operation,
};

export default function ValidationSuccess({ navigation, route }: Props) {
  const { account, parentAccount } = useSelector(accountScreenSelector(route));
  const wcContext = useContext(_wcContext);
  const ptContext = useContext(_ptContext);

  useEffect(() => {
    if (!account) return;
    let result = route.params?.result;
    if (!result) return;
    result =
      result.subOperations && result.subOperations[0]
        ? result.subOperations[0]
        : result;

    if (wcContext.currentCallRequestId) {
      setCurrentCallRequestResult(result.hash);
    }
  }, []);

  const onClose = useCallback(() => {
    navigation.dangerouslyGetParent().pop();
  }, [navigation]);

  const goToOperationDetails = useCallback(() => {
    if (!account) return;
    const result = route.params?.result;
    if (!result) return;
    navigation.navigate(ScreenName.OperationDetails, {
      accountId: account.id,
      parentId: parentAccount && parentAccount.id,
      operation:
        result.subOperations && result.subOperations[0]
          ? result.subOperations[0]
          : result,
    });
  }, [navigation, route.params, account, parentAccount]);

  const [hideProductTourModal, setHideProductTourModal] = useState(true);
  const goToProductTourMenu = () => {
    // $FlowFixMe
    completeStep(ptContext.currentStep);
    navigate(NavigatorName.ProductTour, {
      screen: ScreenName.ProductTourMenu,
    });
    setHideProductTourModal(true);
  };
  useEffect(() => {
    setHideProductTourModal(ptContext.currentStep !== "SEND_COINS");
  }, [ptContext.currentStep]);

  return (
    <View style={styles.root}>
      <TrackScreen category="SendFunds" name="ValidationSuccess" />
      <PreventNativeBack />
      <ValidateSuccess onClose={onClose} onViewDetails={goToOperationDetails} />
      <ProductTourStepFinishedBottomModal
        isOpened={
          ptContext.currentStep === "SEND_COINS" && !hideProductTourModal
        }
        onPress={() => goToProductTourMenu()}
        onClose={() => goToProductTourMenu()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
