import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Flex, Button, Text } from "@ledgerhq/native-ui";
import { TrackScreen } from "../../../../../analytics";
import SelectDevice from "../../../../../components/SelectDevice";
import DeviceActionModal from "../../../../../components/DeviceActionModal";
import { useDispatch } from "react-redux";
import { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import connectManager from "@ledgerhq/live-common/lib/hw/connectManager";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/manager";

import {
  installAppFirstTime,
  setLastConnectedDevice,
  setReadOnlyMode,
} from "../../../../../actions/settings";

const action = createAction(connectManager);

const ConnectNanoScene = ({
  onNext,
  deviceModelId,
}: {
  onNext: () => void;
  deviceModelId: string;
}) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const [device, setDevice] = useState<Device | undefined>();

  const onSetDevice = useCallback(
    device => {
      dispatch(setLastConnectedDevice(device));
      setDevice(device);
    },
    [dispatch],
  );

  const directNext = useCallback(
    device => {
      dispatch(setLastConnectedDevice(device));
      dispatch(setReadOnlyMode(false));
      onNext();
    },
    [dispatch, onNext],
  );

  const onResult = useCallback(
    (info: any) => {
      /** if list apps succeed we update settings with state of apps installed */
      if (info) {
        const hasAnyAppinstalled =
          info.result &&
          info.result.installed &&
          info.result.installed.length > 0;

        dispatch(installAppFirstTime(hasAnyAppinstalled));
        setDevice();
        dispatch(setReadOnlyMode(false));
        onNext();
      }
    },
    [dispatch, onNext],
  );

  const usbOnly = ["nanoS", "nanoSP", "blue"].includes(deviceModelId);

  const Footer = __DEV__ ? (
    <Button mt={7} type="color" outline onPress={onNext}>
      (DEV) skip this step
    </Button>
  ) : null;

  return (
    <>
      <TrackScreen category="Onboarding" name="PairNew" />
      <Flex>
        <SelectDevice
          withArrows
          usbOnly={usbOnly}
          deviceModelId={deviceModelId}
          onSelect={usbOnly ? onSetDevice : directNext}
          autoSelectOnAdd
        />
      </Flex>
      {Footer}
      <DeviceActionModal
        onClose={setDevice}
        device={device}
        onResult={onResult}
        action={action}
        request={null}
      />
    </>
  );
};

ConnectNanoScene.id = "ConnectNanoScene";

export default ConnectNanoScene;
