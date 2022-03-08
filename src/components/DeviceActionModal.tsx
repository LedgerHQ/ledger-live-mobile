import React from "react";
import { View, StyleSheet } from "react-native";
import { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import { SyncSkipUnderPriority } from "@ledgerhq/live-common/lib/bridge/react";
import { Alert } from "@ledgerhq/native-ui";
import { useTranslation } from "react-i18next";
import DeviceAction from "./DeviceAction";
import BottomModal from "./BottomModal";

type Props = {
  // TODO: fix action type
  action: any;
  device: Device | null | undefined;
  // TODO: fix request type
  request?: any;
  onClose?: () => void;
  onModalHide?: () => void;
  onResult?: $PropertyType<React$ElementProps<typeof DeviceAction>, "onResult">;
  renderOnResult?: (p: any) => React.ReactNode;
  onSelectDeviceLink?: () => void;
  analyticsPropertyFlow?: string;
};

export default function DeviceActionModal({
  action,
  device,
  request,
  onClose,
  onResult,
  renderOnResult,
  onModalHide,
  onSelectDeviceLink,
  analyticsPropertyFlow,
}: Props) {
  const { t } = useTranslation();
  return (
    <BottomModal
      id="DeviceActionModal"
      isOpened={!!device}
      onClose={onClose}
      onModalHide={onModalHide}
    >
      {device && (
        <View>
          <View style={styles.footerContainer}>
            <DeviceAction
              action={action}
              device={device}
              request={request}
              onClose={onClose}
              onResult={onResult}
              renderOnResult={renderOnResult}
              onSelectDeviceLink={onSelectDeviceLink}
              analyticsPropertyFlow={analyticsPropertyFlow}
            />
          </View>
          {!device.wired ? (
            <Alert type="info" title={t("DeviceAction.stayInTheAppPlz")} />
          ) : null}
        </View>
      )}
      {device && <SyncSkipUnderPriority priority={100} />}
    </BottomModal>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
});
