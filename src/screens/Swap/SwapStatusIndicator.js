// @flow

import React from "react";
import { View, StyleSheet } from "react-native";
import IconAD from "react-native-vector-icons/dist/AntDesign";
import { operationStatusList } from "@ledgerhq/live-common/lib/swap";
import IconSwap from "../../icons/Swap";
import colors, { rgba } from "../../colors";

export const getStatusColor = (status: string) => {
  if (operationStatusList.pending.includes(status)) {
    return colors.grey;
  }
  if (operationStatusList.finishedOK.includes(status)) {
    return colors.green;
  }
  if (operationStatusList.finishedKO.includes(status)) {
    return colors.alert;
  }
  return colors.grey;
};

const SwapStatusIndicator = ({
  status,
  small,
}: {
  status: string,
  small?: boolean,
}) => {
  const statusColor = getStatusColor(status);
  const sizeDependantStyles = {
    backgroundColor: rgba(statusColor, 0.1),
    width: small ? 38 : 54,
    height: small ? 38 : 54,
  };

  return (
    <View style={[styles.status, sizeDependantStyles]}>
      <IconSwap color={statusColor} size={small ? 16 : 26} />
      {operationStatusList.pending.includes(status) ? (
        <View style={styles.pending}>
          <IconAD
            size={small ? 10 : 14}
            name="clockcircleo"
            color={rgba(colors.darkBlue, 0.5)}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  status: {
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  pending: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderWidth: 2,
    backgroundColor: "#ffffff",
    borderColor: "#ffffff",
    borderRadius: 12,
  },
});

export default SwapStatusIndicator;
