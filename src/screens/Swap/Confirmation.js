// @flow

import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import type { Transaction } from "@ledgerhq/live-common/lib/types";
import type {
  Exchange,
  ExchangeRate,
} from "@ledgerhq/live-common/lib/swap/types";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/transaction";
import { createAction as initSwapCreateAction } from "@ledgerhq/live-common/lib/hw/actions/initSwap";
import initSwap from "@ledgerhq/live-common/lib/swap/initSwap";
import connectApp from "@ledgerhq/live-common/lib/hw/connectApp";
import { useDispatch } from "react-redux";
import { addPendingOperation } from "@ledgerhq/live-common/lib/account";
import addToSwapHistory from "@ledgerhq/live-common/lib/swap/addToSwapHistory";
import { useNavigation } from "@react-navigation/native";
import { ScreenName } from "../../const";
import { updateAccountWithUpdater } from "../../actions/accounts";
import DeviceAction from "../../components/DeviceAction";
import BottomModal from "../../components/BottomModal";
import { useBroadcast } from "../../components/useBroadcast";

import LText from "../../components/LText";
import LoadingFooter from "../../components/LoadingFooter";
import type { DeviceMeta } from "./Form";

const action = createAction(connectApp);
const action2 = initSwapCreateAction(connectApp, initSwap);

type Props = {
  exchange: Exchange,
  exchangeRate: ExchangeRate,
  transaction: Transaction,
  deviceMeta: DeviceMeta,
  onError: (error: Error) => void,
  onCancel: () => void,
};
const Confirmation = ({
  exchange,
  exchangeRate,
  transaction,
  onError,
  onCancel,
  deviceMeta,
}: Props) => {
  const { fromAccount, fromParentAccount } = exchange;
  const [swapData, setSwapData] = useState(null);
  const [signedOperation, setSignedOperation] = useState(null);
  const dispatch = useDispatch();
  const broadcast = useBroadcast({
    account: fromAccount,
    parentAccount: fromParentAccount,
  });
  const tokenCurrency =
    fromAccount && fromAccount.type === "TokenAccount"
      ? fromAccount.token
      : null;
  const navigation = useNavigation();

  const onComplete = useCallback(
    result => {
      const { operation, swapId } = result;
      const account = exchange.fromAccount;
      if (!account) return;
      dispatch(
        updateAccountWithUpdater(account.id, account =>
          addPendingOperation(
            addToSwapHistory(
              account,
              operation,
              transaction,
              { exchange, exchangeRate },
              swapId,
            ),
            operation,
          ),
        ),
      );
      navigation.replace(ScreenName.SwapPendingOperation, { swapId });
    },
    [dispatch, exchange, exchangeRate, navigation, transaction],
  );

  useEffect(() => {
    if (swapData && signedOperation) {
      const { swapId } = swapData;
      broadcast(signedOperation).then(
        operation => {
          onComplete({ operation, swapId });
        },
        error => {
          onError(error);
        },
      );
    }
  }, [broadcast, onComplete, onError, signedOperation, swapData]);

  return (
    <BottomModal
      id="SwapConfirmationFeedback"
      isOpened={true}
      preventBackdropClick
      onClose={onCancel}
      style={styles.root}
    >
      {signedOperation ? (
        <View>
          <LoadingFooter />
          <LText>{"broadcasting"}</LText>
        </View>
      ) : !swapData ? (
        <DeviceAction
          onClose={() => undefined}
          key={"initSwap"}
          action={action2}
          device={deviceMeta}
          request={{
            exchange,
            exchangeRate,
            transaction,
          }}
          onResult={({ initSwapResult, initSwapError, ...rest }) => {
            if (initSwapError) {
              onError(initSwapError);
            } else {
              setSwapData(initSwapResult);
            }
          }}
        />
      ) : (
        <DeviceAction
          action={action}
          device={deviceMeta}
          request={{
            tokenCurrency,
            parentAccount: fromParentAccount,
            account: fromAccount,
            transaction: swapData.transaction,
            appName: "Exchange",
          }}
          onResult={({ transactionSignError, signedOperation }) => {
            if (transactionSignError) {
              onError(transactionSignError);
            } else {
              setSignedOperation(signedOperation);
            }
          }}
        />
      )}
    </BottomModal>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 16,
    minHeight: 280,
    paddingBottom: 0,
    alignItems: "center",
  },
});

export default Confirmation;
