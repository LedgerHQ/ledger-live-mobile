import React from "react";
import { useTranslation } from "react-i18next";
import { Button, NumberedList } from "@ledgerhq/native-ui";
import { useRoute, RouteProp } from "@react-navigation/native";

const items = [
  {
    title: "onboarding.stepSetupDevice.setup.bullets.0.title",
    label: {
      nanoX: "onboarding.stepSetupDevice.setup.bullets.0.label.nanoX",
      nanoSP: "onboarding.stepSetupDevice.setup.bullets.0.label.nanoSP",
      nanoS: "onboarding.stepSetupDevice.setup.bullets.0.label.nanoS",
    },
  },
  {
    title: "onboarding.stepSetupDevice.setup.bullets.1.title",
    label: "onboarding.stepSetupDevice.setup.bullets.1.label",
  },
  {
    title: "onboarding.stepSetupDevice.setup.bullets.2.title",
    label: "onboarding.stepSetupDevice.setup.bullets.2.label",
  },
  {
    title: "onboarding.stepSetupDevice.setup.bullets.3.title",
    label: "onboarding.stepSetupDevice.setup.bullets.3.label",
  },
];

type CurrentRouteType = RouteProp<
  { params: { deviceModelId: "nanoS" | "nanoX" } },
  "params"
>;

const InstructionScene = ({ onNext }: { onNext: () => void }) => {
  const { t } = useTranslation();
  const route = useRoute<CurrentRouteType>();

  return (
    <>
      <NumberedList
        flex={1}
        items={items.map(item => ({
          title: t(item.title),
          description:
            typeof item.label === "string"
              ? t(item.label)
              : t(item.label[route.params.deviceModelId]),
        }))}
      />
      <Button type="main" size="large" onPress={onNext}>
        {t("onboarding.stepSetupDevice.setup.cta")}
      </Button>
    </>
  );
};

InstructionScene.id = "InstructionScene";

export default InstructionScene;
