import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { system } from "styled-system";
import styled from "styled-components/native";

const fillSystem = system({
  fill: {
    property: "fill",
    scale: "colors",
  },
});

const SVG = styled(Svg).attrs(props => ({
  ...fillSystem(props),
}))``;
const PATH = styled(Path).attrs(props => ({
  ...fillSystem(props),
}))``;

type Props = SvgProps & { size?: number; color?: string };

const SvgComponent = ({
  color = "neutral.c00",
  size = 27,
  ...props
}: Props) => (
  <SVG width={size} height={size / 1.14} fill="none" {...props}>
    <PATH
      d="M.872 16.938v6.49h9.876V21.99H2.31v-5.05H.87Zm24.817 0v5.051h-8.437v1.44h9.877v-6.49h-1.44ZM10.762 7.062v9.876h6.49V15.64h-5.05V7.062h-1.44ZM.872.572v6.49H2.31V2.01h8.437V.571H.872Zm16.38 0V2.01h8.438v5.052h1.438V.572h-9.876Z"
      fill={color}
    />
  </SVG>
);

export default SvgComponent;
