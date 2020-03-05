/* @flow */
import React, { useState, useCallback } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/dist/Feather";

import { NavigatorName } from "../../const";
import { accountAndParentScreenSelectorCreator } from "../../reducers/accounts";
import Touchable from "../../components/Touchable";
import BottomModal from "../../components/BottomModal";
import Wrench from "../../icons/Wrench";
import colors from "../../colors";
import TokenContractAddress from "./TokenContractAddress";

export default function AccountHeaderRight() {
  const navigation = useNavigation();
  const route = useRoute();
  const { account, parentAccount } = useSelector(
    accountAndParentScreenSelectorCreator(route),
  );

  const [isOpened, setOpened] = useState(false);

  const toggleModal = useCallback(() => setOpened(!isOpened), [isOpened]);
  const closeModal = () => setOpened(false);

  if (!account) return null;

  if (account.type === "TokenAccount" && parentAccount) {
    return (
      <>
        <Touchable event="ShowContractAddress" onPress={toggleModal}>
          <View style={{ marginRight: 16 }}>
            <Icon name="file-text" size={20} color={colors.grey} />
          </View>
        </Touchable>
        <BottomModal
          id="ContractAddress"
          isOpened={isOpened}
          preventBackdropClick={false}
          onClose={closeModal}
        >
          <TokenContractAddress
            account={account}
            parentAccount={parentAccount}
            onClose={closeModal}
          />
        </BottomModal>
      </>
    );
  }

  if (account.type === "Account") {
    return (
      <Touchable
        event="AccountGoSettings"
        onPress={() => {
          navigation.navigate(NavigatorName.AccountSettings, {
            accountId: account.id,
          });
        }}
      >
        <View style={{ marginRight: 16 }}>
          <Wrench size={16} color={colors.grey} />
        </View>
      </Touchable>
    );
  }

  return null;
}
