// @flow

import React from "react";
import Svg, { Path, G, Ellipse, Circle, Rect } from "react-native-svg";

export default function BluetoothScanning() {
  return (
    <Svg width={171} height={74} viewBox="0 0 171 74">
      <G fill="none" fillRule="evenodd">
        <G stroke="#142533" transform="translate(1 1)">
          <Path
            strokeWidth="2"
            d="M2.16 0h36.68A2.16 2.16 0 0 1 41 2.16v67.68A2.16 2.16 0 0 1 38.84 72H2.16A2.16 2.16 0 0 1 0 69.84V2.16A2.16 2.16 0 0 1 2.16 0z"
          />
          <Path d="M6.356 6.306a1.3 1.3 0 0 0-1.3 1.3v49.82a1.3 1.3 0 0 0 1.3 1.3h28.288a1.3 1.3 0 0 0 1.3-1.3V7.606a1.3 1.3 0 0 0-1.3-1.3H6.356z" />
          <Ellipse cx="20.5" cy="65.032" rx="2.278" ry="2.323" />
          <Path
            strokeWidth="1.6"
            d="M15 36.085l10-8.638L19.634 22v20L25 36.553l-10-8.638"
          />
        </G>
        <G stroke="#142533" transform="translate(158 9)">
          <Path
            strokeWidth="2"
            d="M6.5 28.045c2.792 0 5.056 2.254 5.056 5.034v28.764c0 1.191-.97 2.157-2.167 2.157H3.61a2.162 2.162 0 0 1-2.167-2.157V33.079c0-2.78 2.264-5.034 5.056-5.034z"
          />
          <Ellipse cx="6.49" cy="5.849" rx="2.321" ry="2.254" />
          <Ellipse cx="6.49" cy="33.793" rx="2.321" ry="2.254" />
          <Rect
            width="10.111"
            height="34.517"
            x="1.444"
            y=".719"
            strokeWidth="2"
            rx="2.16"
          />
        </G>
        <G fill="#6490F1" fillRule="nonzero" transform="translate(64 40)">
          <Circle cx="1.5" cy="1.5" r="1.5" opacity=".1" />
          <Circle cx="11.5" cy="1.5" r="1.5" opacity=".2" />
          <Circle cx="21.5" cy="1.5" r="1.5" opacity=".3" />
          <Circle cx="31.5" cy="1.5" r="1.5" opacity=".4" />
          <Circle cx="41.5" cy="1.5" r="1.5" opacity=".5" />
          <Circle cx="51.5" cy="1.5" r="1.5" opacity=".6" />
          <Circle cx="61.5" cy="1.5" r="1.5" opacity=".7" />
          <Circle cx="71.5" cy="1.5" r="1.5" />
        </G>
      </G>
    </Svg>
  );
}
