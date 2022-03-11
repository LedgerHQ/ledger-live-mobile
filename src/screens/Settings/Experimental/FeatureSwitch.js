// @flow

import React, { PureComponent } from "react";

import Track from "../../../analytics/Track";
import Switch from "../../../components/Switch";

type Props = {
  name: string,
  valueOn: mixed,
  valueOff: mixed,
  checked?: boolean,
  readOnly?: boolean,
  onChange: (name: string, val: mixed) => boolean,
};

type State = { checked: boolean };

export default class FeatureSwitch extends PureComponent<Props, State> {
  static defaultProps = {
    valueOn: true,
    valueOff: false,
  };

  onChange = (evt: boolean) => {
    const { onChange, valueOn, valueOff, name } = this.props;
    onChange(name, evt ? valueOn : valueOff);
  };

  render() {
    const { checked = false, name, readOnly } = this.props;
    return (
      <>
        <Track
          onUpdate
          event={checked ? `${name}Enabled` : `${name}Disabled`}
        />
        <Switch
          disabled={readOnly}
          onValueChange={readOnly ? null : this.onChange}
          value={checked}
        />
      </>
    );
  }
}
