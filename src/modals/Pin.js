/* @flow */

import React, { Component } from "react";
import { Trans, translate } from "react-i18next";
import { Image, View, StyleSheet } from "react-native";
import BottomModal from "../components/BottomModal";
import Button from "../components/Button";
import colors from "../colors";
import BulletList, { BulletChevron } from "../components/BulletList";
import LText from "../components/LText";

type Props = { onClose: *, isOpened: *, onAccept: () => * };

class PinModal extends Component<Props> {
  static defaultProps = {
    onAccept: () => {},
  };

  accept = () => {
    const { onClose, onAccept } = this.props;
    onClose();
    onAccept();
  };

  render() {
    const { onClose, isOpened } = this.props;
    return (
      <BottomModal
        id="PinModal"
        style={styles.root}
        isOpened={isOpened}
        onClose={onClose}
      >
        <Image
          style={styles.image}
          source={require("../images/shield-red.png")}
        />
        <View style={styles.wrapper}>
          <BulletList
            Bullet={BulletChevron}
            itemStyle={styles.item}
            list={[
              <Trans i18nKey="onboarding.stepSetupPin.modal.step1">
                {"text"}
                <LText semiBold style={styles.textBlue}>
                  bold text
                </LText>
                {"text"}
              </Trans>,
              <Trans i18nKey="onboarding.stepSetupPin.modal.step2" />,
              <Trans i18nKey="onboarding.stepSetupPin.modal.step3" />,
            ]}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            event="PinGotIt"
            type="primary"
            containerStyle={styles.buttonContainer}
            title={<Trans i18nKey="common.gotit" />}
            onPress={this.accept}
          />
        </View>
      </BottomModal>
    );
  }
}

export default translate()(PinModal);

const styles = StyleSheet.create({
  root: {
    padding: 16,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  wrapper: {
    paddingRight: 16,
  },
  item: { paddingLeft: 0, marginRight: 16 },
  image: {
    alignSelf: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  buttonWrapper: { marginTop: 16, flexDirection: "row" },
  buttonContainer: {
    flexGrow: 1,
    paddingTop: 24,
    paddingHorizontal: 8,
  },
  textBlue: { color: colors.darkBlue },
});
