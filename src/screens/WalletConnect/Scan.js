/* @flow */
import React, { useEffect } from "react";
import Config from "react-native-config";
import { Clipboard } from "react-native";
import Scanner from "../../components/Scanner";
import { ScreenName } from "../../const";
import { TrackScreen } from "../../analytics";
import { connect } from "./Provider";

type Props = {
  navigation: any,
  route: { params: RouteParams },
};

type RouteParams = {
  accountId: String,
};

const ScanWalletConnect = ({ navigation, route }: Props) => {
  useEffect(() => {
    let mockTO;
    if (Config.MOCK_SCAN_WALLETCONNECT) {
      mockTO = setTimeout(async () => {
        onResult(await Clipboard.getString());
      }, 2000);
    }
    return () => clearTimeout(mockTO);
  });

  const onResult = (uri: string) => {
    connect(uri);
    navigation.replace(ScreenName.WalletConnectConnect, {
      uri,
      accountId: route.params.accountId,
    });
  };

  return (
    <>
      <TrackScreen category="WalletConnect" screen="Scan" />
      <Scanner navigation={navigation} onResult={onResult} />
    </>
  );
};

export default ScanWalletConnect;
