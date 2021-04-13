// @flow
import React, { memo, useMemo } from "react";
import { Image, View, StyleSheet } from "react-native";
import manager from "@ledgerhq/live-common/lib/manager";
import {
  findCryptoCurrencyById,
  getCurrencyColor,
} from "@ledgerhq/live-common/lib/currencies";
import { getCryptoCurrencyIcon } from "@ledgerhq/live-common/lib/reactNative";

import type { App } from "@ledgerhq/live-common/lib/types/manager";

import { useTheme } from "@react-navigation/native";
import { ensureContrast } from "../../../colors";

type Props = {
  app: App,
  size: number,
};

function AppIcon({ size = 38, app }: Props) {
  const { currencyId, icon } = app;

  const { colors } = useTheme();

  const uri = useMemo(() => manager.getIconUrl(icon), [icon]);

  const currency = currencyId && findCryptoCurrencyById(currencyId);
  const currencyColor = useMemo(
    () =>
      currency && ensureContrast(getCurrencyColor(currency), colors.background),
    [colors, currency],
  );
  const IconComponent = currency ? getCryptoCurrencyIcon(currency) : null;

  return IconComponent ? (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          backgroundColor: currencyColor,
        },
      ]}
    >
      <IconComponent size={size} color="#FFFFFF" />
    </View>
  ) : (
    <Image
      source={{ uri }}
      style={{ width: size, height: size }}
      fadeDuration={0}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
  },
});

export default memo<Props>(AppIcon);
