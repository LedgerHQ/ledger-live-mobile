//@flow
import "./polyfill";
import React, { Component } from "react";
import App from "./App";

export default class Root extends Component<{}> {
  render() {
    return <App />;
  }
}
