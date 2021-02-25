// @flow

import React from "react";
import Svg, { Path } from "react-native-svg";

const Coins = ({ size, color }: { size: number, color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path
      d="M9.875 0.875C6.76953 0.875 4.25 1.92969 4.25 3.21875V4.77148C2.05273 5.09375 0.5 5.97266 0.5 6.96875V13.5312C0.5 14.8496 3.01953 15.875 6.125 15.875C9.23047 15.875 11.75 14.8496 11.75 13.5312V12.0078C13.918 11.6855 15.5 10.8066 15.5 9.78125V3.21875C15.5 1.92969 12.9805 0.875 9.875 0.875ZM10.3438 13.4434C10.0508 13.7656 8.55664 14.4688 6.125 14.4688C3.66406 14.4688 2.19922 13.7656 1.90625 13.4434V12.2715C2.93164 12.7695 4.42578 13.0625 6.125 13.0625C7.79492 13.0625 9.28906 12.7695 10.3438 12.2715V13.4434ZM10.3438 10.6309C10.0508 10.9531 8.55664 11.6562 6.125 11.6562C3.66406 11.6562 2.19922 10.9531 1.90625 10.6309V9.3125C2.93164 9.89844 4.42578 10.25 6.125 10.25C7.79492 10.25 9.28906 9.89844 10.3438 9.3125V10.6309ZM6.125 8.84375C3.78125 8.84375 1.90625 8.22852 1.90625 7.4375C1.90625 6.67578 3.78125 6.03125 6.125 6.03125C8.43945 6.03125 10.3438 6.67578 10.3438 7.4375C10.3438 8.22852 8.43945 8.84375 6.125 8.84375ZM14.0938 9.69336C13.8594 9.92773 13.0684 10.3379 11.75 10.5723V9.16602C12.6582 9.04883 13.4492 8.81445 14.0938 8.52148V9.69336ZM14.0938 6.88086C13.8594 7.11523 13.0684 7.52539 11.75 7.75977V6.96875C11.75 6.76367 11.6621 6.55859 11.5449 6.38281C12.541 6.20703 13.4199 5.94336 14.0938 5.5625V6.88086ZM9.875 5.09375C9.72852 5.09375 9.58203 5.09375 9.43555 5.09375C8.67383 4.85938 7.76562 4.71289 6.76953 4.6543C6.0957 4.39062 5.65625 4.06836 5.65625 3.6875C5.65625 2.92578 7.53125 2.28125 9.875 2.28125C12.1895 2.28125 14.0938 2.92578 14.0938 3.6875C14.0938 4.47852 12.1895 5.09375 9.875 5.09375Z"
      fill={color}
    />
  </Svg>
);

export default Coins;
