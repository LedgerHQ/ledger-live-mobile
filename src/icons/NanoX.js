// @flow

import React from "react";
import Svg, { Path, G } from "react-native-svg";

type Props = {
  size?: number,
  width?: number,
  height?: number,
  color: string,
  style: *,
};

export default function NanoX({ size, width, height, color, style }: Props) {
  return (
    <Svg
      width={width || size}
      height={height || size}
      viewBox="0 0 8 36"
      style={style}
    >
      <G stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <G fill={color}>
          <G>
            <Path d="M8,16.7744136 C7.57613036,16.1575476 7.00280827,15.6325166 6.30088496,15.2686402 L6.30088496,2.34012033 C6.30088496,2.00460734 6.02889794,1.73262032 5.69338495,1.73262032 L2.30661505,1.73262032 C1.97110206,1.73262032 1.69911504,2.00460734 1.69911504,2.34012033 L1.69911504,15.2686402 C0.997191729,15.6325166 0.423869639,16.1575476 -1.66533454e-16,16.7744136 L0,1.24748673 C-8.27426106e-17,0.558518833 0.54771824,-1.10706898e-15 1.22336293,0 L6.77663707,0 C7.45228176,-1.10706898e-16 8,0.558518833 8,1.24748673 L8,16.7744136 Z M3.93982312,22.5764623 C3.30445118,22.5764623 2.78938046,22.0512348 2.78938046,21.4033338 C2.78938046,20.7554328 3.30445118,20.2302053 3.93982312,20.2302053 C4.57519505,20.2302053 5.09026577,20.7554328 5.09026577,21.4033338 C5.09026577,22.0512348 4.57519505,22.5764623 3.93982312,22.5764623 Z M3.93982312,5.64009873 C3.30445118,5.64009873 2.78938046,5.1148712 2.78938046,4.4669702 C2.78938046,3.81906921 3.30445118,3.29384168 3.93982312,3.29384168 C4.57519505,3.29384168 5.09026577,3.81906921 5.09026577,4.4669702 C5.09026577,5.1148712 4.57519505,5.64009873 3.93982312,5.64009873 Z M2.30661505,34.2673797 L5.69338495,34.2673797 C6.02889794,34.2673797 6.30088496,33.9953927 6.30088496,33.6598797 L6.30088496,20.4756599 C6.30088496,19.5187601 5.42738869,18.4393652 3.99575221,18.4393652 C2.56411574,18.4393652 1.69911504,19.5187601 1.69911504,20.4756599 L1.69911504,33.6598797 C1.69911504,33.9953927 1.97110206,34.2673797 2.30661505,34.2673797 Z M3.99575221,16.7067449 C5.87254287,16.7067449 8,18.5618603 8,20.4756599 L8,34.972658 C8,35.5400433 7.54893792,36 6.99252465,36 L1.00747535,36 C0.45106208,36 6.81409734e-17,35.5400433 0,34.972658 L0,20.4756599 C-2.29840567e-16,18.5618603 2.11896156,16.7067449 3.99575221,16.7067449 Z" />
          </G>
        </G>
      </G>
    </Svg>
  );
}
