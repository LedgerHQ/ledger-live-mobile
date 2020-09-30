// @flow
import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { Trans } from "react-i18next";
import Icon from "react-native-vector-icons/dist/AntDesign";
import { useNavigation } from "@react-navigation/native";
import type {
  CryptoCurrency,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types";
import type { CurrencyStatus } from "@ledgerhq/live-common/lib/swap/logic";
import { ScreenName } from "../../../../const";
import Circle from "../../../../components/Circle";
import BottomModal from "../../../../components/BottomModal";
import LText from "../../../../components/LText";
import Button from "../../../../components/Button";
import colors from "../../../../colors";

const BadSelectionModal = ({
  currency,
  status,
  onClose,
}: {
  currency?: ?(CryptoCurrency | TokenCurrency),
  status: CurrencyStatus,
  onClose: () => void,
}) => {
  const { navigate } = useNavigation();
  const openManagerForApp = useCallback(() => {
    navigate(ScreenName.Manager, {});
  }, [navigate]);
  if (!currency) return null;
  return (
    <BottomModal
      id="ConfirmationModal"
      isOpened={!!currency}
      onClose={undefined}
      style={styles.root}
    >
      <Circle bg={colors.pillActiveBackground} size={40}>
        <Icon name="exclamationcircleo" color={colors.live} size={22} />
      </Circle>
      <LText style={styles.title}>
        <Trans
          i18nKey={`transfer.swap.form.${status}.title`}
          values={{ ticker: currency.ticker }}
        />
      </LText>
      <LText style={styles.desc}>
        <Trans
          i18nKey={`transfer.swap.form.${status}.desc`}
          values={{ currencyName: currency.name }}
        />
      </LText>
      {status === "noApp" ? (
        <>
          <Button
            containerStyle={styles.closeButton}
            onPress={openManagerForApp}
            type={"primary"}
            event={"GoToManagerFromSwapAppNotInstalled"}
            title={<Trans i18nKey={`transfer.swap.form.${status}.cta`} />}
          />
          <Button
            containerStyle={styles.closeButton}
            onPress={onClose}
            outline={false}
            type={"secondary"}
            event={"CloseSwapAppNotInstalled"}
            title={<Trans i18nKey={`transfer.swap.form.${status}.close`} />}
          />
        </>
      ) : (
        <Button
          containerStyle={styles.closeButton}
          onPress={onClose}
          type={"primary"}
          event={"CloseSwapNoAccounts"}
          title={<Trans i18nKey={`transfer.swap.form.${status}.cta`} />}
        />
      )}
    </BottomModal>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 16,
    paddingBottom: 0,
    alignItems: "center",
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 18,
    lineHeight: 22,
    color: colors.black,
  },
  desc: {
    marginBottom: 29,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 18,
    color: colors.smoke,
  },
  closeButton: {
    marginTop: 8,
    width: "100%",
  },
});

export default BadSelectionModal;
