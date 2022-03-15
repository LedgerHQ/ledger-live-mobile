import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { Text, Button, IconBoxList, Icons, Flex } from "@ledgerhq/native-ui";

const items = [
  {
    title: "onboarding.stepImportAccounts.bullets.0.label",
    icon: Icons.ComputerMedium,
  },
  {
    title: "onboarding.stepImportAccounts.bullets.1.label",
    icon: Icons.QrCodeMedium,
  },
  {
    title: "onboarding.stepImportAccounts.bullets.2.label",
    icon: Icons.CheckAloneMedium,
  },
];

const SyncDesktopScene = ({ onNext }: { onNext: () => void }) => {
  const { t } = useTranslation();

  return (
    <>
      <Flex flex={1}>
        <Text variant="h2">{t("onboarding.stepImportAccounts.title")}</Text>
        <Text variant="body" color="neutral.c80" mt={5} mb={8}>
          {t("onboarding.stepImportAccounts.desc")}
        </Text>
        <IconBoxList
          items={items.map(item => ({
            Icon: item.icon,
            title: (
              <Trans i18nKey={item.title}>
                {""}
                <Text fontWeight="bold" />
                {""}
              </Trans>
            ),
          }))}
        />
      </Flex>

      <Button type="main" size="large" onPress={onNext}>
        {t("onboarding.stepImportAccounts.cta")}
      </Button>
    </>
  );
};

SyncDesktopScene.id = "SyncDesktopScene";

export default SyncDesktopScene;
