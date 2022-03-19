import React from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HelpMedium } from "@ledgerhq/native-ui/assets/icons";
import { ScreenName } from "../../const";

const HelpButton = () => {
  const { navigate } = useNavigation();
  return (
    <>
      <TouchableOpacity
        style={{ marginRight: 16 }}
        onPress={() => navigate(ScreenName.Resources)}
      >
        <HelpMedium size={24} color={"neutral.c100"} />
      </TouchableOpacity>
    </>
  );
};

export default HelpButton;
