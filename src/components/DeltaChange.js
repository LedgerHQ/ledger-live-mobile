// @flow
import React, { Component } from "react";
import LText from "./LText";
import colors from "../colors";

export default class DeltaChange extends Component<{
  before: number,
  after: number,
  color?: "western" | "eastern",
  style?: {}
}> {
  render() {
    const { before, after, color } = this.props;
    const style: { color?: * } = {};

    if (!before) {
      return <LText />;
    }

    const percent: number = after / before * 100 - 100;

    if (color === "western") {
      style.color = percent >= 0 ? colors.green : colors.red;
    } else if (color === "eastern") {
      style.color = percent >= 0 ? colors.red : colors.blue;
    }

    return (
      <LText style={[this.props.style, style]}>
        {`${(percent >= 0 ? "+" : "") + percent.toFixed(2)} %`}
      </LText>
    );
  }
}
