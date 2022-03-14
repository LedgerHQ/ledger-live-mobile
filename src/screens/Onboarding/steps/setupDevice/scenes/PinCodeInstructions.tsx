import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { Button, NumberedList } from "@ledgerhq/native-ui";
import NanoDeviceCheckIcon from "../../../../../icons/NanoDeviceCheckIcon";
import NanoDeviceCancelIcon from "../../../../../icons/NanoDeviceCancelIcon";

const items = [
  {
    title: "v3.onboarding.stepSetupDevice.pinCodeSetup.bullets.0.title",
    desc: "v3.onboarding.stepSetupDevice.pinCodeSetup.bullets.0.desc",
  },
  {
    title: "v3.onboarding.stepSetupDevice.pinCodeSetup.bullets.1.title",
    desc: "v3.onboarding.stepSetupDevice.pinCodeSetup.bullets.1.desc",
  },
];

const PinCodeInstructionsScene = ({ onNext }: { onNext: () => void }) => {
  const { t } = useTranslation();

  return (
    <>
      <NumberedList
        flex={1}
        items={items.map(item => ({
          title: t(item.title),
          description: (
            <Trans
              i18nKey={item.desc}
              components={{
                validIcon: <NanoDeviceCheckIcon size={12} />,
                cancelIcon: <NanoDeviceCancelIcon size={12} />,
              }}
            />
          ),
        }))}
      />
      <Button type="main" size="large" onPress={onNext}>
        {t("v3.onboarding.stepSetupDevice.pinCode.cta")}
      </Button>
    </>
  );
};

PinCodeInstructionsScene.id = "PinCodeInstructionsScene";

export default PinCodeInstructionsScene;
