/* @flow */
import React, { useContext, useEffect } from "react";
import Config from "react-native-config";
import { Clipboard } from "react-native";
import { useSelector } from "react-redux";
import Scanner from "../../components/Scanner";
import { ScreenName } from "../../const";
import { TrackScreen } from "../../analytics";
import { accountScreenSelector } from "../../reducers/accounts";
import { context } from "./Provider";

type Props = {
  navigation: any,
  route: { params: RouteParams },
};

type RouteParams = {
  accountId: String,
};

type State = {};

const ScanWalletConnect = ({ navigation, route }: Props) => {
  const { account } = useSelector(
    accountScreenSelector({
      params: { accountId: route.params.accountId },
    }),
  );
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
    wcContext.connect({
      account,
      uri,
    });
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
}

export default ScanWalletConnect;
