// @flow
import React, { Component } from "react";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { createStore, applyMiddleware, compose } from "redux";
import Tor from "react-native-tor";
import { getAccounts, getCountervalues, getSettings, getBle } from "../db";
import reducers from "../reducers";
import { importSettings } from "../actions/settings";
import { importStore as importAccounts } from "../actions/accounts";
import { importBle } from "../actions/ble";
import { INITIAL_STATE, supportedCountervalues } from "../reducers/settings";
const http = require("http");
const https = require("https");

const axios = require("axios");
const { SocksProxyAgent } = require("socks-proxy-agent");

// Initialize the module
const tor = Tor();

// $FlowFixMe
export const store = createStore(
  reducers,
  undefined,
  // $FlowFixMe
  compose(
    applyMiddleware(thunk),
    typeof __REDUX_DEVTOOLS_EXTENSION__ === "function"
      ? __REDUX_DEVTOOLS_EXTENSION__()
      : f => f,
  ),
);

export default class LedgerStoreProvider extends Component<
  {
    onInitFinished: () => void,
    children: (ready: boolean, store: *, initialCountervalues: *) => *,
  },
  {
    ready: boolean,
    initialCountervalues: *,
  },
> {
  state = {
    ready: false,
    initialCountervalues: undefined,
  };

  componentDidMount() {
    return this.init();
  }

  componentDidCatch(e: *) {
    console.error(e);
    throw e;
  }

  async init() {
    const bleData = await getBle();
    store.dispatch(importBle(bleData));

    try {
      console.log("torstart");
      const proxy = await tor.startIfNotStarted();
      console.log("prxy", proxy);
      const response1 = await axios.get("https://api.ipify.org?format=json");
      console.log("response1", response1.data);

      const agent = new SocksProxyAgent(`socks5h://127.0.0.1:${proxy}`);

      const response2 = await axios({
        url: "https://api.ipify.org?format=json",
        proxy: false,
        httpsAgent: agent,
        httpAgent: agent,
      });

      http.globalAgent = agent;
      https.globalAgent = agent;

      console.log("response21", response2.data);
    } catch (e) {
      console.error(e);
    }

    const settingsData = await getSettings();
    if (
      settingsData &&
      settingsData.counterValue &&
      !supportedCountervalues.find(
        ({ ticker }) => ticker === settingsData.counterValue,
      )
    ) {
      settingsData.counterValue = INITIAL_STATE.counterValue;
    }
    store.dispatch(importSettings(settingsData));

    const accountsData = await getAccounts();
    store.dispatch(importAccounts(accountsData));

    const initialCountervalues = await getCountervalues();

    this.setState({ ready: true, initialCountervalues }, () => {
      this.props.onInitFinished();
    });
  }

  render() {
    const { children } = this.props;
    const { ready, initialCountervalues } = this.state;
    return (
      <Provider store={store}>
        {children(ready, store, initialCountervalues)}
      </Provider>
    );
  }
}
