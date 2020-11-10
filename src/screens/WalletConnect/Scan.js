/* @flow */
import React, { PureComponent } from "react";
import Config from "react-native-config";
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
      setTimeout(() => {
        this.onResult(Config.MOCK_SCAN_WALLETCONNECT);
      }, 2000);
    }
  }

  onResult = (result: string) => {
    this.props.navigation.replace(ScreenName.WalletConnectConnect, {
      wcURL: result,
    });
  };

  render() {
    const { navigation } = this.props;

    return <Scanner navigation={navigation} onResult={this.onResult} />;
  }
}

export default ScanWalletConnect;
