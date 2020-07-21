// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import DeviceAction from "./DeviceAction";
import BottomModal from "./BottomModal";
import ModalBottomAction from "./ModalBottomAction";

type Props = {
  // TODO: fix action type
  action: any,
  device: Device,
  onClose: () => void,
  isOpened: boolean,
  onResult: $PropertyType<React$ElementProps<typeof DeviceAction>, "onResult">,
};

export default function DeviceActionModal({
  action,
  isOpened,
  device,
  onClose,
  onResult,
}: Props) {
  return (
    <BottomModal
      id="DeviceActionModal"
      isOpened={isOpened}
      onClose={onClose}
      onResult={onResult}
    >
      <ModalBottomAction
        footer={
          <View style={styles.footerContainer}>
            <DeviceAction
              action={action}
              device={device}
              onClose={onClose}
              onResult={onResult}
            />
          </View>
        }
      />
    </BottomModal>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: "row",
  },
});
