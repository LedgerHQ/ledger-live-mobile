import React from "react";
import { Svg, Circle, G } from "react-native-svg";
import { useTheme } from "styled-components/native";
import { TouchableOpacity } from "react-native";
import { Flex } from "@ledgerhq/native-ui";

type Props = {
  // float number between 0 and 1
  progress?: number;
  infinite: boolean;

  // function triggered when pressing the loader
  onPress?: () => void;

  mainColor: string;
  secondaryColor: string;

  radius: number;
  strokeWidth: number;

  // Display an icon in the middle
  // Icon?: React.ComponentType<{ color: string; size: number }>;
  children: React.ReactNode;
};

const ProgressLoader = ({
  progress = 0,
  infinite,
  mainColor,
  secondaryColor,
  onPress,
  radius = 48,
  strokeWidth = 4,
  children,
}: Props): React.ReactElement => {
  const { colors } = useTheme();
  const backgroundColor = secondaryColor || colors.neutral.c40;
  const progressColor = mainColor || colors.primary.c80;

  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset = circumference - progress * circumference;

  return (
    <TouchableOpacity disabled={!onPress} onPress={onPress}>
      <Flex alignItems="center" justifyContent="center">
        <Svg width={radius * 2} height={radius * 2}>
          <Circle
            cx={radius}
            cy={radius}
            r={radius * 0.92}
            fill="transparent"
            stroke={backgroundColor}
            strokeDashoffset={0}
            strokeWidth={strokeWidth}
          />
          <G transform={`rotate(-90) translate(-${radius * 2}, 0)`}>
            <Circle
              cx={radius}
              cy={radius}
              r={radius * 0.92}
              fill="transparent"
              stroke={progressColor}
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
            />
          </G>
        </Svg>
        <Flex position="absolute">{children}</Flex>
      </Flex>
    </TouchableOpacity>
  );
};

export default ProgressLoader;
