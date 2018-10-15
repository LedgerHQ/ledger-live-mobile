// @flow

import React, { PureComponent } from "react";
import Svg, { G, Path, Ellipse, Rect, Circle } from "react-native-svg";

class PairingSuccess extends PureComponent {
  render() {
    return (
      <Svg width={114} height={114} viewBox="0 0 114 114">
        <G fill="none" fillRule="evenodd">
          <Path
            fill="#EFF3FD"
            fillRule="nonzero"
            d="M74.733 11.043a22.503 22.503 0 0 0-.94 6.457c0 12.426 10.073 22.5 22.5 22.5 2.43 0 4.769-.385 6.961-1.098a53.315 53.315 0 0 1 4.539 21.598c0 29.547-23.953 53.5-53.5 53.5-29.548 0-53.5-23.953-53.5-53.5S24.745 7 54.293 7a53.34 53.34 0 0 1 20.44 4.043z"
          />
          <G
            fillRule="nonzero"
            stroke="#6490F1"
            strokeLinecap="round"
            opacity=".2"
          >
            <Path
              strokeWidth="1.5"
              d="M69.058 70.667A13.558 13.558 0 0 0 73.093 61c0-3.74-1.51-7.126-3.951-9.584"
            />
            <Path
              strokeWidth="2"
              d="M71.195 78.198c5.492-3.744 9.098-10.05 9.098-17.198 0-6.95-3.41-13.105-8.648-16.882"
            />
            <Path
              strokeWidth="2"
              d="M73.311 85.358c8.47-4.815 14.182-13.92 14.182-24.358 0-10.274-5.534-19.256-13.783-24.127"
            />
          </G>
          <G
            fillRule="nonzero"
            stroke="#6490F1"
            strokeLinecap="round"
            strokeWidth="2"
            opacity=".2"
          >
            <Path d="M37.527 70.667A13.558 13.558 0 0 1 33.493 61c0-3.74 1.509-7.126 3.95-9.584" />
            <Path d="M35.39 78.198c-5.492-3.744-9.097-10.05-9.097-17.198 0-6.95 3.41-13.105 8.647-16.882" />
            <Path d="M33.274 85.358C24.804 80.543 19.093 71.438 19.093 61c0-10.274 5.533-19.256 13.783-24.127" />
          </G>
          <G
            fillRule="nonzero"
            stroke="#6490F1"
            transform="translate(46.793 29)"
          >
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
          <G transform="translate(78.793)">
            <Circle
              cx="17.5"
              cy="17.5"
              r="17.5"
              fill="#72B74A"
              fillRule="nonzero"
            />
            <G transform="translate(10 10)">
              <G fill="#FFF" mask="url(#b)">
                <Path d="M0 0h16v16H0z" />
              </G>
            </G>
          </G>
        </G>
      </Svg>
    );
  }
}

export default PairingSuccess;
