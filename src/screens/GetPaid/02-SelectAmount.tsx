import React, { memo, useCallback, useState, useEffect } from "react";
import styled from "styled-components/native";
import { Flex, BaseInput } from "@ledgerhq/native-ui";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { BigNumber } from "bignumber.js";
import messaging from "@react-native-firebase/messaging";
import KeyboardView from "../../components/KeyboardView";
import AmountInput from "../SendFunds/AmountInput";
import { accountScreenSelector } from "../../reducers/accounts";
import Button from "../../components/wrappedUi/Button";
import { ScreenName } from "../../const";

const StyledSafeAreaView = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.main};
`;

const SelectAmount = () => {
  const route = useRoute();

  const { account, parentAccount } = useSelector(accountScreenSelector(route));
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [amount, setAmount] = useState(new BigNumber(0));
  const [message, setMessage] = useState("");
  const [fcm, setFcm] = useState(null);

  useEffect(() => {
    messaging()
      .getToken()
      .then(setFcm)
      .catch(console.error);
  }, []);

  const blur = useCallback(() => Keyboard.dismiss(), []);

  const onContinue = useCallback(() => {
    if (account)
      navigation.navigate(ScreenName.GetPaidConfirmation, {
        accountId: account.id,
        parentId: parentAccount && parentAccount.id,
        amount: amount.toString(),
        message,
        fcm,
      });
  }, [account, navigation, parentAccount, amount, message, fcm]);

  return account ? (
    <StyledSafeAreaView>
      <Flex flex={1} p={6}>
        <KeyboardView style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={blur}>
            <Flex flex={1}>
              <AmountInput
                account={account}
                onChange={setAmount}
                value={amount}
              />
              <Flex mb={6}>
                <BaseInput
                  value={message}
                  placeholder={t("transfer.getPaid.selectAmount.placeholder")}
                  onChange={setMessage}
                />
              </Flex>
              <Button type="main" disabled={amount.lte(0)} onPress={onContinue}>
                {t("common.continue")}
              </Button>
            </Flex>
          </TouchableWithoutFeedback>
        </KeyboardView>
      </Flex>
    </StyledSafeAreaView>
  ) : null;
};

export default memo(SelectAmount);
