/* @flow */
import React, { Component } from "react";
import { withTranslation, Trans } from "react-i18next";
import Button from "./Button";

class RetryButton extends Component<*> {
  render() {
    return (
      <Button
        type="primary"
        title={<Trans i18nKey="common.retry" />}
        {...this.props}
      />
    );
  }
}

export default withTranslation()(RetryButton);
