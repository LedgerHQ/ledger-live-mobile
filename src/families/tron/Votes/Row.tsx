import React, { useCallback } from "react";
import { View, Linking, StyleSheet, TouchableOpacity } from "react-native";

import { getAddressExplorer } from "@ledgerhq/live-common/lib/explorers";

import { ExplorerView } from "@ledgerhq/live-common/lib/types";

import { Flex, Text } from "@ledgerhq/native-ui";
import { useTheme } from "styled-components/native";
import Clock from "../../../icons/Clock";
import Trophy from "../../../icons/Trophy";
import Medal from "../../../icons/Medal";

type Props = {
  validator: any;
  address: string;
  amount: number;
  duration?: React.ReactNode;
  explorerView?: ExplorerView;
  isSR: boolean;
  isLast?: boolean;
};

const Row = ({
  validator,
  address,
  amount,
  duration,
  explorerView,
  isSR,
  isLast = false,
}: Props) => {
  const { colors } = useTheme();
  const srURL = explorerView && getAddressExplorer(explorerView, address);

  const openSR = useCallback(() => {
    if (srURL) Linking.openURL(srURL);
  }, [srURL]);

  return (
    <View style={styles.root}>
      <View style={styles.row}>
        <View
          style={[
            styles.icon,
            !isSR
              ? { backgroundColor: colors.lightFog }
              : { backgroundColor: colors.lightLive },
          ]}
        >
          {isSR ? (
            <Trophy size={16} color={colors.live} />
          ) : (
            <Medal size={16} color={colors.grey} />
          )}
        </View>
        <View style={styles.labelContainer}>
          <TouchableOpacity onPress={openSR}>
            <Text
              variant={"body"}
              fontWeight={"semiBold"}
              numberOfLines={1}
              pb={2}
            >
              {validator ? validator.name : address}
            </Text>
          </TouchableOpacity>
          <Flex flexDirection={"row"} alignItems={"center"}>
            <Clock size={12} color={colors.neutral.c80} />
            <Text variant={"paragraph"} color={"neutral.c80"} ml={2}>
              {duration}
            </Text>
          </Flex>
        </View>
        <View style={[styles.labelContainer, styles.labelContainerRight]}>
          <Text variant={"paragraph"} color={"neutral.c80"} ml={2}>
            {amount}
          </Text>
        </View>
      </View>
      {!isLast && (
        <View
          style={[styles.separator, { backgroundColor: colors.lightFog }]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 12,
  },
  separator: {
    height: 1,
    width: "100%",
    marginTop: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: 5,
    marginRight: 12,
  },
  title: {
    fontSize: 14,
    lineHeight: 16,
    paddingBottom: 4,
  },
  labelContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    flex: 1,
  },
  labelContainerRight: {
    alignItems: "flex-end",
    marginLeft: 10,
    flexShrink: 1,
    flex: 0,
  },
  label: {
    fontSize: 13,
    marginLeft: 6,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Row;
