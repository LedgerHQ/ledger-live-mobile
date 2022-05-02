import React, { ReactNode, useCallback, useMemo } from "react";
import { Linking } from "react-native";
import { useTranslation } from "react-i18next";
import { BottomDrawer, Flex, Icons, Link, Text } from "@ledgerhq/native-ui";
import styled from "styled-components/native";

import { useTermsAccept } from "../logic/terms";
import { useLocale } from "../context/Locale";
import Button from "./Button";
import Alert from "./Alert";
import { urls } from "../config/urls";

const Description = styled(Text).attrs(() => ({
  color: "neutral.c70",
}))``;

const Divider = styled(Flex).attrs(() => ({
  my: 4,
  height: 1,
  backgroundColor: "neutral.c40",
}))``;

const Update = ({ children }: { children: ReactNode }) => (
  <Flex flexDirection="row">
    <Description mr={2}>{"•"}</Description>
    <Description>{children}</Description>
  </Flex>
);

const CheckTermOfUseUpdateModal = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const [accepted, accept] = useTermsAccept();

  const termsURL = useMemo(() => urls.terms[locale] || urls.terms.en, [locale]);

  const handleLink = useCallback(() => {
    Linking.openURL(termsURL);
  }, [termsURL]);

  return (
    <BottomDrawer
      id="TermOfUseUpdate"
      title={t("updatedTerms.title")}
      isOpen={!accepted}
      onClose={accept}
    >
      <Flex mb={6}>
        <Description>{t("updatedTerms.body.intro")}</Description>
        <Flex my={4}>
          <Update>{t("updatedTerms.body.bulletPoints.0")}</Update>
          <Update>{t("updatedTerms.body.bulletPoints.1")}</Update>
          <Update>{t("updatedTerms.body.bulletPoints.2")}</Update>
        </Flex>
        <Description>{t("updatedTerms.body.agreement")}</Description>
      </Flex>
      <Alert type="help" noIcon>
        <Link type="color" onPress={handleLink} Icon={Icons.ExternalLinkMedium}>
          {t("updatedTerms.link")}
        </Link>
      </Alert>
      <Divider />
      <Button type="main" outline={false} onPress={accept}>
        {t("updatedTerms.cta")}
      </Button>
    </BottomDrawer>
  );
};

export default CheckTermOfUseUpdateModal;
