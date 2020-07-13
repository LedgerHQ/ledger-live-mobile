/* @flow */
import React, { Component, useEffect, useCallback, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Trans } from "react-i18next";
import manager from "@ledgerhq/live-common/lib/manager";
import { disconnect } from "@ledgerhq/live-common/lib/hw";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import { removeKnownDevice } from "../../actions/ble";
import { ScreenName } from "../../const";
import {
  connectingStep,
  dashboard,
  listApps,
  getDeviceName,
} from "../../components/DeviceJob/steps";
import SelectDevice from "../../components/SelectDevice";
import colors from "../../colors";
import TrackScreen from "../../analytics/TrackScreen";
import { track } from "../../analytics";
import LText from "../../components/LText";
import Button from "../../components/Button";
import type { DeviceLike } from "../../reducers/ble";
import Trash from "../../icons/Trash";
import BottomModal from "../../components/BottomModal";
import ModalBottomAction from "../../components/ModalBottomAction";
import NavigationScrollView from "../../components/NavigationScrollView";
import ReadOnlyNanoX from "./Connect/ReadOnlyNanoX";
import { readOnlyModeEnabledSelector } from "../../reducers/settings";

type Props = {
  navigation: any,
  knownDevices: DeviceLike[],
};

export default function Screen({ navigation }: Props) {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const readOnlyModeEnabled = useSelector(readOnlyModeEnabledSelector);
  const [showMenu, setShowMenu] = useState(false);
  const [device, setDevice] = useState();

  const onShowMenu = useCallback((device: Device) => {
    setDevice(device);
    setShowMenu(true);
  }, []);

  const onHideMenu = useCallback(() => {
    setShowMenu(false);
  }, []);

  const remove = useCallback(async () => {
    if (!device) {
      return;
    }
    dispatch(removeKnownDevice(device.deviceId));
    await disconnect(device.deviceId).catch(() => {});
    onHideMenu();
  }, [device, onHideMenu, dispatch]);

  const onSelect = useCallback((device: Device) => {
    console.log(JSON.stringify(device, null, 2));
  }, []);

  const onConnect = useCallback(() => {
    // const { version, mcuVersion } = meta.deviceInfo;
    // track("ManagerDeviceEntered", {
    //   version,
    //   mcuVersion,
    // });
    // this.props.navigation.navigate(ScreenName.ManagerMain, {
    //   meta,
    // });
  });

  useEffect(() => {
    if (!readOnlyModeEnabled) {
      return;
    }
    navigation.setParams({
      title: "manager.readOnly.title",
      headerRight: null,
    });
  }, [readOnlyModeEnabled, navigation]);

  if (!isFocused) return null;

  if (readOnlyModeEnabled) {
    return <ReadOnlyNanoX navigation={navigation} />;
  }

  return (
    <NavigationScrollView style={styles.root}>
      <TrackScreen category="Manager" name="ChooseDevice" />
      <LText semiBold style={styles.title}>
        <Trans i18nKey="manager.connect" />
      </LText>

      <SelectDevice onSelect={onSelect} onBluetoothDeviceAction={onShowMenu} />

      {device && (
        <RemoveDeviceModal
          onHideMenu={onHideMenu}
          open={showMenu}
          remove={remove}
          deviceName={device.deviceName || ""}
        />
      )}
    </NavigationScrollView>
  );
}

function RemoveDeviceModal({
  onHideMenu,
  remove,
  open,
  deviceName,
}: {
  onHideMenu: () => void,
  remove: () => Promise<void>,
  open: boolean,
  deviceName: string,
}) {
  return (
    <BottomModal id="DeviceItemModal" isOpened={open} onClose={onHideMenu}>
      <ModalBottomAction
        title={deviceName}
        footer={
          <View style={styles.footerContainer}>
            <Button
              event="HardResetModalAction"
              type="alert"
              IconLeft={Trash}
              title={<Trans i18nKey="common.forgetDevice" />}
              onPress={remove}
              containerStyle={styles.buttonContainer}
            />
          </View>
        }
      />
    </BottomModal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
  },
  or: {
    marginVertical: 30,
  },
  title: {
    lineHeight: 27,
    fontSize: 18,
    marginVertical: 24,
    color: colors.darkBlue,
  },
  section: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 12,
    color: colors.grey,
  },
  addContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  add: {
    marginRight: 8,
    color: colors.live,
  },
  bluetoothHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  footerContainer: {
    flexDirection: "row",
  },
  buttonContainer: {
    flex: 1,
  },
  buttonMarginLeft: {
    marginLeft: 16,
  },
});
