// @flow
import React, { useCallback } from "react";
import { Linking } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { Trans } from "react-i18next";
import { useTheme } from "styled-components/native";
import { Flex, Text, Icons, List, Link, Button } from "@ledgerhq/native-ui";
import { ScreenName } from "../../../const";
import { TrackScreen } from "../../../analytics";
import { urls } from "../../../config/urls";

const forceInset = { bottom: "always" };

type Props = {
  navigation: any;
  route: { params: any };
};

const Check = <Icons.CheckAloneMedium size={20} color={"success.c100"} />;

export default function DelegationStarted({ navigation, route }: Props) {
  const { colors } = useTheme();
  const onNext = useCallback(() => {
    navigation.navigate(ScreenName.DelegationSummary, {
      ...route.params,
    });
  }, [navigation, route.params]);

  const howDelegationWorks = useCallback(() => {
    Linking.openURL(urls.delegation);
  }, []);

  return (
    <SafeAreaView
      style={[
        { flex: 1, justifyContent: "space-between" },
        { backgroundColor: colors.background.main },
      ]}
      forceInset={forceInset}
    >
      <Flex flex={1} m={6}>
        <TrackScreen category="DelegationFlow" name="Started" />
        <Text textAlign={"center"} variant="h2" fontWeight="semiBold" py={8}>
          <Trans i18nKey="delegation.started.title" />
        </Text>
        <Text variant="body" fontWeight="medium" textAlign="center" mb={6}>
          <Trans i18nKey="delegation.started.description" />
        </Text>
        <List
          items={[
            <Trans i18nKey="delegation.started.steps.0" />,
            <Trans i18nKey="delegation.started.steps.1" />,
            <Trans i18nKey="delegation.started.steps.2" />,
          ].map(wording => ({ title: wording, bullet: Check }))}
          itemContainerProps={{
            alignItems: "center",
          }}
          my={8}
        />
        <Link
          type="color"
          size="medium"
          iconPosition="right"
          Icon={Icons.ExternalLinkMedium}
          onPress={howDelegationWorks}
        >
          <Trans i18nKey="delegation.howDelegationWorks" />
        </Link>
      </Flex>
      <Flex p={6}>
        <Button event="DelegationStartedBtn" onPress={onNext} type="main">
          <Trans i18nKey="delegation.started.cta" />
        </Button>
      </Flex>
    </SafeAreaView>
  );
}
