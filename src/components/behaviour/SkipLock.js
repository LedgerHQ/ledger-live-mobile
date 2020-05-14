// @flow
import React, { PureComponent, useContext } from "react";
import { useIsFocused } from "@react-navigation/native";

// $FlowFixMe
export const SkipLockContext = React.createContext((_: boolean) => {});

class SkipLock extends PureComponent<{
  setEnabled: (enabled: boolean) => void,
  isFocused: boolean,
}> {
  lastValue = false;

  componentDidMount() {
    this.report(this.props.isFocused);
  }

  componentDidUpdate() {
    this.report(this.props.isFocused);
  }

  componentWillUnmount() {
    this.report(false);
  }

  report = enabled => {
    if (this.lastValue !== enabled) {
      this.props.setEnabled(enabled);
      this.lastValue = enabled;
    }
  };

  render() {
    return null;
  }
}

export default function(props: any) {
  const isFocused = useIsFocused();
  const setEnabled = useContext(SkipLockContext);

  return <SkipLock {...props} isFocused={isFocused} setEnabled={setEnabled} />;
}
