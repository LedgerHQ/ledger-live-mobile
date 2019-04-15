/* @flow */

import React, { Component } from "react";
import { Trans, translate } from "react-i18next";
import { Image, View, StyleSheet } from "react-native";
import BottomModal from "../components/BottomModal";
import Button from "../components/Button";
import BulletList, { BulletChevron } from "../components/BulletList";

type Props = { isOpened: *, onClose: *, onAccept: () => * };

class RecoveryPhraseModal extends Component<Props> {
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
        id="RecoveryPhraseModal"
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
              <Trans i18nKey="onboarding.stepWriteRecovery.modal.step1" />,
              <Trans i18nKey="onboarding.stepWriteRecovery.modal.step2" />,
              <Trans i18nKey="onboarding.stepWriteRecovery.modal.step3" />,
              <Trans i18nKey="onboarding.stepWriteRecovery.modal.step4" />,
            ]}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            event="RecoveryPhraseGotIt"
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

export default translate()(RecoveryPhraseModal);

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
});
