// @flow

import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import { Trans } from "react-i18next";
import {
  getCryptoCurrencyById,
  getCurrencyColor,
} from "@ledgerhq/live-common/lib/currencies";
import BottomModal from "../../components/BottomModal";
import type { Props as BottomProps } from "../../components/BottomModal";
import LText from "../../components/LText";
import Button from "../../components/Button";
import CurrencyIcon from "../../components/CurrencyIcon";

type Props = BottomProps & {
  isOpened: boolean,
  onClose: () => void,
  onPress: () => void,
};

function ConfirmationModal({ isOpened, onClose, onPress, ...rest }: Props) {
  const currency = getCryptoCurrencyById("bitcoin");
  const color = getCurrencyColor(currency);
  return (
    <BottomModal
      style={styles.confirmationModal}
      {...rest}
      id="ptstartwithbitcoinmodal"
      isOpened={isOpened}
      onClose={onClose}
    >
      <View style={[styles.icon, { backgroundColor: color }]}>
        <CurrencyIcon size={50} currency={currency} color="#FFF" bg={color} />
      </View>
      <LText secondary semiBold style={styles.title}>
        <Trans i18nKey="producttour.startwithbitcoinbottommodal.title" />
      </LText>
      <LText style={styles.description} color="smoke">
        <Trans i18nKey="producttour.startwithbitcoinbottommodal.description" />
      </LText>
      <View style={styles.confirmationFooter}>
        <Button
          event="step locked button"
          containerStyle={styles.confirmationButton}
          type="primary"
          title={
            <Trans i18nKey="producttour.startwithbitcoinbottommodal.cta" />
          }
          onPress={onPress}
        />
      </View>
    </BottomModal>
  );
}

const styles = StyleSheet.create({
  confirmationModal: {
    paddingVertical: 24,
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  title: {
    textAlign: "center",
    fontSize: 18,
  },
  description: {
    marginVertical: 32,
    textAlign: "center",
    fontSize: 14,
  },
  confirmationFooter: {
    justifyContent: "flex-end",
  },
  confirmationButton: {
    flexGrow: 1,
  },
  confirmationLastButton: {
    marginTop: 16,
  },
  icon: {
    alignSelf: "center",
    width: 56,
    borderRadius: 28,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
});

export default memo<Props>(ConfirmationModal);
