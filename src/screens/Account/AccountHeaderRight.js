/* @flow */
import React, { useState, useCallback, useEffect } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/dist/FontAwesome";

import {
  getDefaultExplorerView,
  getAccountContractExplorer,
} from "@ledgerhq/live-common/lib/explorers";
import { getMainAccount } from "@ledgerhq/live-common/lib/account/helpers";
import { NavigatorName, ScreenName } from "../../const";
import { accountScreenSelector } from "../../reducers/accounts";
import Touchable from "../../components/Touchable";
import BottomModal from "../../components/BottomModal";
import Wrench from "../../icons/Wrench";
import colors from "../../colors";
import TokenContractAddress from "./TokenContractAddress";
import BlacklistTokenModal from "../Settings/Accounts/BlacklistTokenModal";

export default function AccountHeaderRight() {
  const navigation = useNavigation();
  const route = useRoute();
  const { account, parentAccount } = useSelector(accountScreenSelector(route));

  const [isOpened, setOpened] = useState(false);
  const [isShowingContract, setIsShowingContract] = useState(false);

  const toggleModal = useCallback(() => setOpened(!isOpened), [isOpened]);
  const closeModal = () => {
    setIsShowingContract(false);
    setOpened(false);
  };

  useEffect(() => {
    if (!account) {
      navigation.navigate("Accounts");
    }
  }, [account, navigation]);

  if (!account) return null;

  if (account.type === "TokenAccount" && parentAccount) {
    const mainAccount = getMainAccount(account, parentAccount);
    const explorerView = getDefaultExplorerView(mainAccount.currency);

    const url = getAccountContractExplorer(
      explorerView,
      account,
      parentAccount,
    );

    return (
      <>
        <Touchable event="ShowContractAddress" onPress={toggleModal}>
          <View style={{ marginRight: 16 }}>
            <Icon name="ellipsis-h" size={20} color={colors.grey} />
          </View>
        </Touchable>
        {isOpened ? (
          isShowingContract && url ? (
            <BottomModal
              id="ContractAddress"
              isOpened={isOpened}
              preventBackdropClick={false}
              onClose={closeModal}
            >
              <TokenContractAddress
                account={account}
                onClose={closeModal}
                url={url}
              />
            </BottomModal>
          ) : (
            <BlacklistTokenModal
              isOpened={isOpened}
              onClose={closeModal}
              onShowContract={url ? setIsShowingContract : null}
              token={account.token}
            />
          )
        ) : null}
      </>
    );
  }

  if (account.type === "Account") {
    return (
      <Touchable
        event="AccountGoSettings"
        onPress={() => {
          navigation.navigate(NavigatorName.AccountSettings, {
            screen: ScreenName.AccountSettingsMain,
            params: {
              accountId: account.id,
            },
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
