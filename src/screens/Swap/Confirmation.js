// @flow

import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import type { Transaction } from "@ledgerhq/live-common/lib/types";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { concat, of, from } from "rxjs";
import { concatMap, filter } from "rxjs/operators";
import type {
  Exchange,
  ExchangeRate,
} from "@ledgerhq/live-common/lib/swap/types";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/app";
import { createAction as initSwapCreateAction } from "@ledgerhq/live-common/lib/hw/actions/initSwap";
import initSwap from "@ledgerhq/live-common/lib/swap/initSwap";
import connectApp from "@ledgerhq/live-common/lib/hw/connectApp";

import DeviceActionModal from "../../components/DeviceActionModal";
import BottomModal from "../../components/BottomModal";
import LText from "../../components/LText";
import LoadingFooter from "../../components/LoadingFooter";
import { updateAccountWithUpdater } from "../../actions/accounts";
import { connectingStep, initSwapStep } from "../../components/DeviceJob/steps";
import type { DeviceMeta } from "./Form";

const action = createAction(connectApp);
const action2 = initSwapCreateAction(connectApp, initSwap);

type Props = {
  exchange: Exchange,
  exchangeRate: ExchangeRate,
  transaction: Transaction,
  deviceMeta: DeviceMeta,
  onComplete: (swapId: string) => void,
  onError: (error: Error) => void,
  onCancel: () => void,
};
const Confirmation = ({
  exchange,
  exchangeRate,
  transaction,
  onComplete,
  onError,
  onCancel,
  deviceMeta,
}: Props) => {
  const { fromAccount, fromParentAccount } = exchange;
  const dispatch = useDispatch();
  const [swapData, setSwapData] = useState(null);
  const [signed, setSigned] = useState(false);
  const [error, setError] = useState(null);
  /*
  useEffect(() => {
    if (swapData) {
      const bridge = getAccountBridge(fromAccount);
      const mainAccount = getMainAccount(fromAccount, fromParentAccount);
      const { transaction } = swapData;
      bridge
        .signOperation({ account: mainAccount, transaction, deviceId })
        .pipe(
          filter(e => e.type === "signed"),
          concatMap(e =>
            concat(
              of(e),
              from(
                bridge
                  .broadcast({
                    account: mainAccount,
                    signedOperation: e.signedOperation,
                  })
                  .then(operation => ({ type: "broadcasted", operation })),
              ),
            ),
          ),
        )
        .subscribe({
          next: e => {
            switch (e.type) {
              case "signed":
                setSigned(true);
                break;
              case "broadcasted":
                dispatch(
                  updateAccountWithUpdater(mainAccount.id, a => {
                    return {
                      ...a,
                      swapHistory: [
                        ...(a.swapHistory || []),
                        {
                          status: "new",
                          provider: exchangeRate.provider,
                          operationId: e.operation.id,
                          swapId: swapData.swapId,
                          receiverAccountId: exchange.toAccount.id,
                          fromAmount: transaction.amount,
                          toAmount: transaction.amount.times(
                            exchangeRate.magnitudeAwareRate,
                          ),
                        },
                      ],
                    };
                  }),
                );
                onComplete(swapData.swapId);
                break;

              default:
            }
          },
          error: e => {
            setError(e);
          },
        });
    }
  }, [
    deviceId,
    dispatch,
    exchange,
    exchangeRate,
    fromAccount,
    fromParentAccount,
    onComplete,
    swapData,
  ]);
*/
  return !swapData && !error ? (
    <DeviceActionModal
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
          debugger;
          onError(initSwapError);
        } else {
          debugger;
          setSwapData(initSwapResult);
        }
      }}
    />
  ) : (
    <LText>{"something else"}</LText>
  );
  // return !swapData && !error ? (
  //   <DeviceJob
  //     meta={{ deviceId, deviceName, modelId: "nanoX" }}
  //     deviceModelId="nanoX"
  //     steps={[
  //       connectingStep,
  //       initSwapStep({ exchange, exchangeRate, transaction }),
  //     ]}
  //     onCancel={onCancel}
  //     onDone={({ initSwapResult, error }) => {
  //       if (error) {
  //         onError(error);
  //       } else if (initSwapResult) {
  //         setSwapData({
  //           transaction: initSwapResult.transaction,
  //           swapId: initSwapResult.swapId,
  //           fromParentAccount,
  //           fromAccount,
  //         });
  //       }
  //     }}
  //   />
  // ) : (
  //   <BottomModal
  //     id="SwapConfirmationFeedback"
  //     isOpened={true}
  //     onClose={onCancel}
  //     style={styles.root}
  //   >
  //     {!signed ? (
  //       <LText>{"Signing the transaction"}</LText>
  //     ) : (
  //       <LText>{"Broadcasting the transaction"}</LText>
  //     )}
  //     <LoadingFooter />
  //   </BottomModal>
  // );
};

const styles = StyleSheet.create({
  root: {
    padding: 16,
    paddingBottom: 0,
    alignItems: "center",
  },
});

export default Confirmation;
