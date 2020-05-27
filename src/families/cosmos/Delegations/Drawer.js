// @flow
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import BottomModal from "../../../components/BottomModal";
import Close from "../../../icons/Close";
import colors from "../../../colors";

type Props = {
  isOpen: boolean,
  onClose: () => void,
};

export default function DelegationDrawer({ isOpen, onClose }: Props) {
  return (
    <BottomModal
      id="InfoModal"
      style={styles.root}
      isOpened={isOpen}
      onClose={onClose}
    >
      <View>
        <TouchableOpacity style={styles.closeIconWrapper} onPress={onClose}>
          <Close />
        </TouchableOpacity>
      </View>
    </BottomModal>
  );
}

const CLOSE_ICON_WRAPPER_SIZE = 32;

const styles = StyleSheet.create({
  root: {
    padding: 16,
  },
  closeIconWrapper: {
    width: CLOSE_ICON_WRAPPER_SIZE,
    height: CLOSE_ICON_WRAPPER_SIZE,
    borderRadius: CLOSE_ICON_WRAPPER_SIZE / 2,
    backgroundColor: colors.lightFog,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
});
