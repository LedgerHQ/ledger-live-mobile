// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import BottomModal from "../../../components/BottomModal";

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
      <View />
    </BottomModal>
  );
}
const styles = StyleSheet.create({
  root: {
    padding: 16,
  },
});
