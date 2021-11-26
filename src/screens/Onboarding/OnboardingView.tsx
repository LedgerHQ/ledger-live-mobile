import React from "react";
import { View, SafeAreaView } from "react-native";
import {
  useTheme,
  useNavigation,
  StackActions,
} from "@react-navigation/native";
import { Icons } from "@ledgerhq/native-ui/assets";
import { Flex, Text } from "@ledgerhq/native-ui";
import { TouchableOpacity } from "react-native";

const hitSlop = {
  bottom: 10,
  left: 24,
  right: 24,
  top: 10,
};

type Props = {
  title: React.ReactNode;
  subTitle?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  hasBackButton?: boolean;
  hasCloseButton?: boolean;
  customBackAction?: () => {};
  customCloseAction?: () => {};
  centerTitle?: boolean;
};

function OnboardingView({
  title,
  subTitle,
  hasBackButton,
  hasCloseButton,
  customBackAction,
  customCloseAction,
  children,
  footer,
  centerTitle,
}: Props) {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const handlecustomBackAction = () => {
    if (customBackAction) return customBackAction();
    navigation.goBack();
  };

  const handlecustomCloseAction = () => {
    if (customCloseAction) return customCloseAction();
    navigation.dispatch(StackActions.popToTop());
  };

  return (
    <SafeAreaView style={[{ flex: 1 }, { backgroundColor: colors.background }]}>
      <Flex flex={1} paddingX={6}>
        {/* HEADER */}
        <Flex mb={8}>
          <Flex flexDirection="row" justifyContent="space-between" mb={subTitle ? 9 : 6}>
            <View>
              {hasBackButton ? (
                <TouchableOpacity onPress={handlecustomBackAction} hitSlop={hitSlop}>
                  <Icons.ArrowLeftMedium size="24px" />
                </TouchableOpacity>
              ) : null}
            </View>
            <View>
              {hasCloseButton ? (
                <TouchableOpacity onPress={handlecustomCloseAction} hitSlop={hitSlop}>
                  <Icons.CloseMedium size="24px" />
                </TouchableOpacity>
              ) : null}
            </View>
          </Flex>

          {/* HEADER TITLES */}
          <Flex>
            <Text variant="h1" fontSize={8} mb={3} textAlign={centerTitle ? "center" : null}>
              {title}
            </Text>
            {subTitle ? (
              <Text variant="body" fontSize={4}>
                {subTitle}
              </Text>
            ) : null}
          </Flex>
        </Flex>

        {/* BODY */}
        {children ? <Flex flex={1}>{children}</Flex> : null}

        {/* FOOTER */}
        {footer ? <Flex>{footer}</Flex> : null}
      </Flex>
    </SafeAreaView>
  );
}

export default OnboardingView;
