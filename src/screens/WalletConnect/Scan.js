/* @flow */
import React, { PureComponent } from "react";
import Config from "react-native-config";
import { Clipboard } from "react-native";
import Scanner from "../../components/Scanner";
import { ScreenName } from "../../const";

type Props = {
  navigation: any,
};

type RouteParams = {};

type State = {};

class ScanWalletConnect extends PureComponent<Props, State> {
  componentDidMount() {
    if (Config.MOCK_SCAN_WALLETCONNECT) {
      setTimeout(async () => {
        this.onResult(await Clipboard.getString());
      }, 2000);
    }
  }

  onResult = (uri: string) => {
    this.props.navigation.replace(ScreenName.WalletConnectConnect, {
      uri,
      defaultAccount: this.props.route.params.defaultAccount,
    });
  };

  render() {
    const { navigation } = this.props;

    return <Scanner navigation={navigation} onResult={this.onResult} />;
  }
}

export default ScanWalletConnect;
