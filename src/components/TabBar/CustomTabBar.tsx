import React from "react";
import { Flex } from "@ledgerhq/native-ui";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import Svg, { Path } from "react-native-svg";
import { BAR_HEIGHT, HAS_GRADIENT } from "./shared";
import BackgroundGradient from "./BackgroundGradient";

type SvgProps = {
  color: string;
};

// const DEBUG_ZONES = true;
const DEBUG_ZONES = false;

const getBgColor = (colors: any) => colors.neutral.c20;

function TabBarShape({ color }: SvgProps) {
  return (
    <Svg
      width={375}
      height={BAR_HEIGHT}
      viewBox={`0 0 375 ${BAR_HEIGHT}`}
      fill="none"
    >
      <Path d="M0 0H80V56H0V0Z" fill={color} />
      <Path
        d="M80 0H130.836C140.091 0 148.208 6.17679 150.676 15.097L151.848 19.3368C156.369 35.6819 171.243 47 188.202 47C205.439 47 220.484 35.3142 224.748 18.6125L225.645 15.097C227.913 6.21473 235.914 0 245.081 0H295V56H80V0Z"
        fill={color}
      />
      <Path d="M295 0H375V56H295V0Z" fill={color} />
    </Svg>
  );
}

const BackgroundFiller = styled(Flex).attrs(p => ({
  position: "absolute",
  height: BAR_HEIGHT,
  width: "30%",
  backgroundColor: DEBUG_ZONES ? "lightgreen" : getBgColor(p.theme.colors),
}))``;

const BottomFiller = styled(Flex).attrs(p => ({
  position: "absolute",
  width: "100%",
  backgroundColor: DEBUG_ZONES ? "lightblue" : getBgColor(p.theme.colors),
}))``;

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
  colors,
  insets,
}: any): JSX.Element {
  const bgColor = getBgColor(colors);
  const { bottom: bottomInset } = insets;
  return (
    <Flex
      width="100%"
      flexDirection="row"
      height={56}
      bottom={bottomInset}
      position="absolute"
      overflow="visible"
    >
      {HAS_GRADIENT && <BackgroundGradient colors={colors} />}
      <BottomFiller bottom={-bottomInset} height={bottomInset} />
      <BackgroundFiller left={0} />
      <BackgroundFiller right={0} />
      <Flex
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        position="absolute"
        left={-2}
        right={0}
      >
        <TabBarShape color={DEBUG_ZONES ? "lightcoral" : bgColor} />
      </Flex>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;
        const Icon = options.tabBarIcon;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        if (index === 2) {
          return (
            <>
              <Flex flex={1} />
              <Flex
                pointerEvents="box-none"
                style={{
                  ...StyleSheet.absoluteFillObject,
                  top: undefined,
                  bottom: -bottomInset,
                  height: Dimensions.get("screen").height,
                  flex: 1,
                  alignItems: "center",
                  zIndex: 1,
                  justifyContent: "flex-end",
                }}
              >
                <Icon
                  color={isFocused ? colors.primary.c80 : colors.neutral.c80}
                />
              </Flex>
            </>
          );
        }

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              alignItems: "center",
            }}
          >
            <Icon color={isFocused ? colors.primary.c80 : colors.neutral.c80} />
          </TouchableOpacity>
        );
      })}
    </Flex>
  );
}
