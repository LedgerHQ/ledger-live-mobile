// @flow

import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { Trans } from "react-i18next";
import colors from "../../colors";
import BottomModal from "../../components/BottomModal";
import type { Props as BMProps } from "../../components/BottomModal";
import LText from "../../components/LText";
import Button from "../../components/Button";
import Info from "../../icons/Info";
import TrackScreen from "../../analytics/TrackScreen";
import { context as _ptContext } from "./Provider";

type Props = BMProps & {
  onPress: Function,
};

const ProductTourStepFinishedBottomModal = ({
  isOpened,
  onClose,
  onPress,
  ...rest
}: Props) => {
  const ptContext = useContext(_ptContext);

  return (
    <BottomModal
      id="ProductTourStepFinishedBottomModal"
      isOpened={isOpened}
      onClose={onClose}
      style={styles.confirmationModal}
      {...rest}
    >
      {isOpened && ptContext.currentStep ? (
        <TrackScreen
          category="ProductTourStepFinishedBottomModal"
          name={ptContext.currentStep}
        />
      ) : null}
      <View style={styles.icon}>
        <Info size={24} color={colors.orange} />
      </View>
      <LText style={styles.description}>Step finished</LText>
      <View style={styles.confirmationFooter}>
        <Button
          event={`ProductTourStepFinishedBottomModal continue ${ptContext.currentStep ||
            ""}`}
          containerStyle={styles.confirmationButton}
          type="primary"
          title={<Trans i18nKey="producttour.stepFinishedContinue" />}
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
    color: colors.darkBlue,
  },
  description: {
    marginVertical: 32,
    textAlign: "center",
    fontSize: 14,
    color: colors.smoke,
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
    backgroundColor: colors.lightOrange,
    width: 56,
    borderRadius: 28,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
});

export default ProductTourStepFinishedBottomModal;
