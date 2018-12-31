// @flow
import React from "react";
import Svg, { G, Rect, Path } from "react-native-svg";

const DeviceIconCheck = ({ size = 15 }: { size?: number }) => (
  <Svg width={size} height={size}>
    <G fill="#6490F1">
      <Rect width={size} height={size} fillOpacity={0.3} rx={2} />
      <Path d="M9.5 5.5v-1h2v2h-1v1h-1v1h-1v1h-1v1h-2v-1h-1v-1h-1v-2h2v1h2v-1h1v-1h1z" />
    </G>
  </Svg>
);

export default DeviceIconCheck;
