// @flow

import React, { useState, useCallback, useRef, useEffect } from "react";
import { StyleSheet, FlatList } from "react-native";
import { useSelector } from "react-redux";
import { Trans } from "react-i18next";
import { Observable } from "rxjs";
import logger from "../../logger";
import { BLE_SCANNING_NOTHING_TIMEOUT } from "../../constants";
import { knownDevicesSelector } from "../../reducers/ble";
import type { DeviceLike } from "../../reducers/ble";
import TransportBLE from "../../react-native-hw-transport-ble";
import { TrackScreen } from "../../analytics";
import DeviceItem from "../../components/DeviceItem";
import ScanningHeader from "./ScanningHeader";

type Props = {
  knownDevices: DeviceLike[],
  onSelect: (device: Device) => void,
  onError: (error: Error) => void,
  onTimeout: () => void,
};

type Device = {
  id: string,
  name: string,
};

export default function Scanning({ onTimeout, onError, onSelect }: Props) {
  const knownDevices = useSelector(knownDevicesSelector);
  const [devices, setDevices] = useState<Device[]>([]);
  const sub = useRef();
  const timeout = useRef();

  const renderItem = useCallback(
    ({ item }) => {
      const knownDevice = knownDevices.find(d => d.id === item.id);
      return (
        <DeviceItem
          device={item}
          deviceMeta={{
            deviceId: item.id,
            deviceName: item.name,
            wired: false,
            modelId: "nanoX",
          }}
          onSelect={() => onSelect(item)}
          disabled={!!knownDevice}
          description={
            knownDevice ? <Trans i18nKey="PairDevices.alreadyPaired" /> : ""
          }
        />
      );
    },
    [onSelect, knownDevices],
  );

  const startScan = useCallback(async () => {
    sub.current = Observable.create(TransportBLE.listen).subscribe({
      next: e => {
        if (e.type === "add") {
          clearTimeout(timeout.current);
          const device = e.descriptor;
          // FIXME seems like we have dup. ideally we'll remove them on the listen side!
          setDevices(devices =>
            devices.some(i => i.id === device.id)
              ? devices
              : [...devices, device],
          );
        }
      },
      error: error => {
        logger.critical(error);
        onError(error);
      },
    });
  }, [onError]);

  useEffect(() => {
    timeout.current = setTimeout(() => {
      onTimeout();
    }, BLE_SCANNING_NOTHING_TIMEOUT);
    startScan();

    return () => {
      sub.current?.unsubscribe();
      clearTimeout(timeout.current);
    };
  }, [onTimeout, startScan]);

  return (
    <>
      <TrackScreen category="PairDevices" name="Scanning" />
      <FlatList
        style={styles.list}
        data={devices}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={ScanningHeader}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
