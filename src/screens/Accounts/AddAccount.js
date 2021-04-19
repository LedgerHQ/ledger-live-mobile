// @flow

import React, { useState, useRef } from "react";
import { View } from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import Icon from "react-native-vector-icons/dist/Feather";
import Touchable from "../../components/Touchable";
import AddAccountsModal from "../AddAccounts/AddAccountsModal";
import { reportLayout } from "../ProductTour/Provider";

export default function AddAccount({
  isAddModalOpened,
  setIsAddModalOpened,
}: {
  isAddModalOpened: boolean,
  setIsAddModalOpened: Function,
}) {
  const { colors } = useTheme();
  const navigation = useNavigation();

  function openAddModal() {
    setIsAddModalOpened(true);
  }

  function closeAddModal() {
    setIsAddModalOpened(false);
  }

  const ref = useRef();

  return (
    <View
      ref={ref}
      onLayout={() =>
        reportLayout(["headerAddAccount"], ref, {
          y: -5,
          height: 10,
          width: -15,
          x: 5,
        })
      }
    >
      <Touchable
        event="OpenAddAccountModal"
        style={{ marginHorizontal: 16 }}
        onPress={openAddModal}
      >
        <Icon name="plus" color={colors.grey} size={20} />
        <AddAccountsModal
          navigation={navigation}
          isOpened={isAddModalOpened}
          onClose={closeAddModal}
        />
      </Touchable>
    </View>
  );
}
