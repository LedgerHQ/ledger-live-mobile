// @flow

import React, { useCallback, useState } from "react";
import { Trans } from "react-i18next";
import { StyleSheet, View } from "react-native";
import type { SwapRouteParams } from "..";
import DisclaimerModal from "../DisclaimerModal";
import Button from "../../../../components/Button";
import Confirmation from "../../Confirmation";
import SummaryBody from "./SummaryBody";
import colors from "../../../../colors";
import { ScreenName } from "../../../../const";

type Props = {
  navigation: any,
  route: {
    params: SwapRouteParams,
  },
};

const SwapFormSummary = ({ navigation, route }: Props) => {
  const {
    exchange,
    exchangeRate,
    transaction,
    status,
    deviceName,
    deviceId,
  } = route.params;
  const [confirmed, setConfirmed] = useState(false);
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);

  const reset = useCallback(() => {
    setConfirmed(false);
    setAcceptedDisclaimer(false);
  }, [setAcceptedDisclaimer, setConfirmed]);

  return (
    <View style={styles.root}>
      <SummaryBody
        exchange={exchange}
        exchangeRate={exchangeRate}
        status={status}
      />
      {confirmed ? (
        acceptedDisclaimer ? (
          <Confirmation
            exchange={exchange}
            exchangeRate={exchangeRate}
            transaction={transaction}
            deviceId={deviceId}
            deviceName={deviceName}
            onComplete={swapId =>
              navigation.replace(ScreenName.SwapPendingOperation, { swapId })
            }
            onError={error => {
              reset();
              navigation.navigate(ScreenName.SwapError, { error });
            }}
            onCancel={reset}
          />
        ) : (
          <DisclaimerModal
            provider={exchangeRate.provider}
            onContinue={() => setAcceptedDisclaimer(true)}
            onClose={() => setConfirmed(false)}
          />
        )
      ) : (
        <View style={styles.buttonWrapper}>
          <Button
            event="SwapSummaryConfirm"
            type={"primary"}
            disabled={confirmed}
            title={<Trans i18nKey="transfer.swap.form.button" />}
            onPress={() => setConfirmed(true)}
            containerStyle={styles.button}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 16,
    paddingTop: 32,
    backgroundColor: colors.white,
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  button: {
    width: "100%",
  },
});

export default SwapFormSummary;
