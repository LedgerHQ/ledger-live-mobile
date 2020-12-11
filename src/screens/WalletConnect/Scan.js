/* @flow */
import React, { useEffect, useContext } from "react";
import Config from "react-native-config";
import Clipboard from "@react-native-community/clipboard";
import Scanner from "../../components/Scanner";
import { ScreenName } from "../../const";
import { TrackScreen } from "../../analytics";
import { connect, context, STATUS } from "./Provider";

type Props = {
  navigation: any,
  route: { params: RouteParams },
};

type RouteParams = {
  accountId: String,
};

const ScanWalletConnect = ({ navigation, route }: Props) => {
  const wcContext = useContext(context);

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
    if (wcContext.status !== STATUS.DISCONNECTED) {
      return;
    }
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
