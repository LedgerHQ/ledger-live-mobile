import React, { ReactNode, useCallback, useMemo } from "react";
import { Linking } from "react-native";
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
  const { locale } = useLocale();
  const [accepted, accept] = useTermsAccept();

  const termsURL = useMemo(() => urls.terms[locale] || urls.terms.en, [locale]);

  const handleLink = useCallback(() => {
    Linking.openURL(termsURL);
  }, [termsURL]);

  return (
    <BottomDrawer
      id="TermOfUseUpdate"
      title="Terms of use update"
      isOpen={!accepted}
      onClose={accept}
    >
      <Flex mb={6}>
        <Description>
          {`Hi! We've updated our Ledger Live Terms of Use with the aim to make them clearer and to reflect Ledger Live's newly available services and features. Key updates are focused on:`}
        </Description>
        <Flex my={4}>
          <Update>
            {"Clarifying what services are available and how they work"}
          </Update>
          <Update>{"Explaining how fees for Services work"}</Update>
          <Update>
            {
              "Improving our notification process to make sure that you are properly informed of any new changes to our Terms of Use"
            }
          </Update>
        </Flex>
        <Description>
          {`By clicking on "Continue" you agree that you have read and accept the Terms of Use below.`}
        </Description>
      </Flex>
      <Alert type="help" noIcon>
        <Link type="color" onPress={handleLink} Icon={Icons.ExternalLinkMedium}>
          Terms of use
        </Link>
      </Alert>
      <Divider />
      <Button type="main" outline={false} onPress={accept}>
        Continue
      </Button>
    </BottomDrawer>
  );
};

export default CheckTermOfUseUpdateModal;
