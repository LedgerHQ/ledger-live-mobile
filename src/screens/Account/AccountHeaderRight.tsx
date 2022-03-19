import React, { useState, useCallback, useEffect } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation, useRoute, useTheme } from "@react-navigation/native";
import Icon from "react-native-vector-icons/dist/FontAwesome";
import { NavigatorName, ScreenName } from "../../const";
import Touchable from "../../components/Touchable";
import Wrench from "../../icons/Wrench";
import { accountScreenSelector } from "../../reducers/accounts";
import TokenContextualModal from "../Settings/Accounts/TokenContextualModal";
import { FiltersMedium, OthersMedium } from "@ledgerhq/native-ui/assets/icons";

export default function AccountHeaderRight() {
  const navigation = useNavigation();
  const route = useRoute();
  const { account, parentAccount } = useSelector(accountScreenSelector(route));

  const [isOpened, setOpened] = useState(false);

  const toggleModal = useCallback(() => setOpened(!isOpened), [isOpened]);
  const closeModal = () => {
    setOpened(false);
  };

  useEffect(() => {
    if (!account) {
      navigation.navigate(ScreenName.Accounts);
    }
  }, [account, navigation]);

  if (!account) return null;

  if (account.type === "TokenAccount" && parentAccount) {
    return (
      <>
        <Touchable
          event="ShowContractAddress"
          onPress={toggleModal}
          style={{ alignItems: "center", justifyContent: "center", margin: 16 }}
        >
          <View>
            <OthersMedium size={24} color={"neutral.c100"} />
          </View>
        </Touchable>
        <TokenContextualModal
          account={account}
          isOpened={isOpened}
          onClose={closeModal}
        />
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
        style={{ alignItems: "center", justifyContent: "center", margin: 16 }}
      >
        <View>
          <FiltersMedium size={24} color="neutral.c100" />
        </View>
      </Touchable>
    );
  }

  return null;
}
