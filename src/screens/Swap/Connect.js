// @flow

import React from "react";
import { Trans } from "react-i18next";
import { StyleSheet } from "react-native";
import SelectDevice from "../../components/SelectDevice/legacy";
import {
  connectingStep,
  dashboard,
  listApps,
} from "../../components/DeviceJob/steps";
import LText from "../../components/LText";
import colors from "../../colors";

const Connect = ({ setResult }: { setResult: () => void }) => {
  return (
    <>
      <LText semiBold style={styles.selectDevice}>
        <Trans i18nKey={"transfer.swap.selectDevice"} />
      </LText>
      <SelectDevice
        withArrows
        onSelect={setResult}
        steps={[connectingStep, dashboard, listApps]}
        autoSelectOnAdd
      />
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white,
  },
  selectDevice: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 20,
  },
  debugText: {
    marginBottom: 10,
  },
});

export default Connect;
