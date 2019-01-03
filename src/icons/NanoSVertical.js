// @flow

import React from "react";
import Svg, { Path, G, Ellipse } from "react-native-svg";

export default function NanoSVertical() {
  return (
    <Svg viewBox="0 0 13 72" width="13" height="72">
      <G fill="none" fillRule="evenodd">
        <Path
          fill="#1D2028"
          d="M12.48 4.114a.52.52 0 0 1 .52.52V7.71a.52.52 0 1 1-1.04 0V4.634a.52.52 0 0 1 .52-.52zM12.48 17.486a.52.52 0 0 1 .52.52v3.074a.52.52 0 1 1-1.04 0v-3.074a.52.52 0 0 1 .52-.52z"
        />
        <Path
          fill="#6490F1"
          fillOpacity=".1"
          stroke="#1D2028"
          strokeWidth="1.5"
          d="M1.6.75a.85.85 0 0 0-.85.85v68.8c0 .47.38.85.85.85h9.28c.47 0 .85-.38.85-.85V1.6a.85.85 0 0 0-.85-.85H1.6z"
        />
        <Path
          fill="#FFF"
          stroke="#6490F1"
          strokeWidth=".5"
          d="M3.92 4.364a.55.55 0 0 0-.55.55v21.017c0 .303.246.55.55.55h4.64a.55.55 0 0 0 .55-.55V4.914a.55.55 0 0 0-.55-.55H3.92z"
        />
        <Path
          fill="#FFF"
          stroke="#1D2028"
          strokeWidth="1.5"
          d="M6.24 31.607a5.49 5.49 0 0 0-5.49 5.49V70.4c0 .47.38.85.85.85h9.28c.47 0 .85-.38.85-.85V37.097a5.49 5.49 0 0 0-5.49-5.49z"
        />
        <Ellipse
          cx="6.24"
          cy="37.029"
          fill="#FFF"
          stroke="#6490F1"
          strokeWidth=".5"
          rx="2.87"
          ry="2.836"
        />
      </G>
    </Svg>
  );
}
