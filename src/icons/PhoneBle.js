import React, { PureComponent } from "react";
import Svg, { G, Path, Ellipse } from "react-native-svg";

class PhoneBle extends PureComponent<{ size?: number }> {
  static defaultProps = {
    size: 43,
  };

  render() {
    const { size } = this.props;
    return (
      <Svg
        viewBox="0 0 43 74"
        width={size}
        height={(size * 74) / 43}
        {...this.props}
      >
        <G fillRule="nonzero" stroke="#142533" fill="none">
          <Path
            d="M4.006 1.002a3.005 3.005 0 0 0-3.004 3.004v63.988a3.005 3.005 0 0 0 3.004 3.004h33.05a3.005 3.005 0 0 0 3.004-3.004V4.006a3.005 3.005 0 0 0-3.004-3.004H4.006z"
            strokeWidth={2.003}
          />
          <Path
            strokeWidth={1.602}
            d="M15.023 40.085l10.015-8.638L19.664 26v20l5.374-5.447-10.015-8.638"
          />
          <Ellipse
            strokeWidth={1.099}
            cx={20.531}
            cy={64.5}
            rx={2.504}
            ry={2.5}
          />
        </G>
      </Svg>
    );
  }
}

export default PhoneBle;
