// @flow

import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import { View, StyleSheet } from "react-native";

import { rgba, withTheme } from "../colors";
import BottomModal from "./BottomModal";
import LText from "./LText";
import Button from "./Button";

type Props = {|
  isOpened: boolean,
  onClose: () => void,
  onConfirm: () => *,
  onModalHide?: () => *,
  confirmationTitle?: React$Node,
  confirmationDesc?: React$Node,
  Icon?: React$ComponentType<*>,
  confirmButtonText?: React$Node,
  rejectButtonText?: React$Node,
  hideRejectButton?: boolean,
  alert: boolean,
  colors: *,
|};

class ConfirmationModal extends PureComponent<Props> {
  static defaultProps = {
    alert: false,
  };

  render() {
    const {
      isOpened,
      onClose,
      confirmationTitle,
      confirmationDesc,
      confirmButtonText,
      rejectButtonText,
      onConfirm,
      Icon,
      alert,
      hideRejectButton,
      colors,
      ...rest
    } = this.props;
    return (
      <BottomModal
        id="ConfirmationModal"
        isOpened={isOpened}
        onClose={onClose}
        style={styles.confirmationModal}
        {...rest}
      >
        {Icon && (
          <View
            style={[
              styles.icon,
              { backgroundColor: rgba(colors.yellow, 0.08) },
            ]}
          >
            <Icon size={24} />
          </View>
        )}
        {confirmationTitle && (
          <LText secondary semiBold style={styles.confirmationTitle}>
            {confirmationTitle}
          </LText>
        )}
        {confirmationDesc && (
          <LText style={styles.confirmationDesc} color="smoke">
            {confirmationDesc}
          </LText>
        )}
        <View style={styles.confirmationFooter}>
          {!hideRejectButton && (
            <Button
              event="ConfirmationModalCancel"
              containerStyle={styles.confirmationButton}
              type="secondary"
              title={rejectButtonText || <Trans i18nKey="common.cancel" />}
              onPress={onClose}
            />
          )}

          <Button
            event="ConfirmationModalConfirm"
            containerStyle={[
              styles.confirmationButton,
              styles.confirmationLastButton,
            ]}
            type={alert ? "alert" : "primary"}
            title={confirmButtonText || <Trans i18nKey="common.confirm" />}
            onPress={onConfirm}
          />
        </View>
      </BottomModal>
    );
  }
}

const styles = StyleSheet.create({
  confirmationModal: {
    paddingVertical: 24,
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  confirmationTitle: {
    textAlign: "center",
    fontSize: 18,
  },
  confirmationDesc: {
    marginVertical: 24,
    paddingHorizontal: 32,
    textAlign: "center",
    fontSize: 14,
  },
  confirmationFooter: {
    flexDirection: "row",
  },
  confirmationButton: {
    flexGrow: 1,
  },
  confirmationLastButton: {
    marginLeft: 16,
  },
  icon: {
    alignSelf: "center",
    width: 56,
    borderRadius: 28,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default withTheme(ConfirmationModal);
