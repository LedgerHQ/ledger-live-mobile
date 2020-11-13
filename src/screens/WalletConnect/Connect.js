/* @flow */
import React, { useContext } from "react";
import { useTranslation, Trans } from "react-i18next";
import { View, StyleSheet, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import _ from "lodash";
import LText from "../../components/LText";
import Button from "../../components/Button";
import { context, STATUS } from "./Provider";
import Spinning from "../../components/Spinning";
import BigSpinner from "../../icons/BigSpinner";
import Disconnect from "../../icons/Disconnect";
import CurrencyIcon from "../../components/CurrencyIcon";
import InfoBox from "../../components/InfoBox";
import WarningBox from "../../components/WarningBox";
import colors from "../../colors";

const DottedLine = () => {
  return (
    <View style={styles.dottedLineContainer}>
      {_.map(_.range(0, 6), i => (
        <View style={styles.dot} key={i} />
      ))}
    </View>
  );
};

export default function Connect({ route, navigation }) {
  const { t } = useTranslation();
  const wcContext = useContext(context);

  useFocusEffect(() => {
    if (route.params.uri && wcContext.status === STATUS.DISCONNECTED) {
      wcContext.connect({
        account: route.params.defaultAccount,
        uri: route.params.uri,
      });
    }
    if (wcContext.currentCallRequestId) {
      console.log("abort error");
      wcContext.setCurrentCallRequestError(new Error("Aborted"));
    }
  }, [wcContext, route]);

  console.log("wccontext", wcContext);
  const correctIcons = _.filter((wcContext.dappInfo || {}).icons, icon =>
    ["png", "jpg", "jpeg", "bmp", "gif"].includes(icon.split(".")[-1]),
  );

  return (
    <>
      <View style={styles.container}>
        {wcContext.status === STATUS.CONNECTING && wcContext.approveSession ? (
          <>
            <View style={styles.centerContainer}>
              <View style={styles.headerContainer}>
                <Image
                  source={
                    correctIcons.length
                      ? correctIcons[0]
                      : require("../../images/walletconnect.png")
                  }
                  style={styles.logo}
                />
                <DottedLine />
                <Image
                  source={require("../../images/logo_small.png")}
                  style={styles.logo}
                />
              </View>
              <LText semiBold style={styles.peerName}>
                {wcContext.dappInfo.name}
              </LText>
              <LText primary style={styles.details}>
                {wcContext.dappInfo.url}
              </LText>
            </View>
            <LText primary style={[styles.details, styles.infos]}>
              Wants to connect to the following Ethereum account through your
              wallet :
            </LText>
            <View style={styles.accountContainer}>
              <View style={styles.accountTitleContainer}>
                <CurrencyIcon
                  size={24}
                  currency={route.params.defaultAccount.currency}
                />
                <LText semiBold primary style={styles.accountName}>
                  {route.params.defaultAccount.name}
                </LText>
              </View>
              <LText primary style={styles.details}>
                {route.params.defaultAccount.freshAddress}
              </LText>
            </View>
          </>
        ) : wcContext.status === STATUS.CONNECTED ? (
          <>
            <View style={styles.centerContainer}>
              <Image
                source={
                  correctIcons.length
                    ? correctIcons[0]
                    : require("../../images/walletconnect.png")
                }
                style={styles.logo}
              />
              <LText semiBold style={styles.peerName}>
                {wcContext.dappInfo.name}
              </LText>
              <LText primary style={styles.details}>
                Connected
              </LText>
            </View>
            <View style={styles.messagesContainer}>
              <InfoBox>
                <Trans i18nKey="transfer.lending.banners.needApproval" />
              </InfoBox>
              <View style={styles.messagesSeparator} />
              <WarningBox>
                {"Sharing receive addresses from dApp is not secure. Always use Ledger Live when sharing your address to receive funds."}
              </WarningBox>
            </View>
          </>
        ) : wcContext.status === STATUS.ERROR ? (
          <>
            <LText>Error</LText>
          </>
        ) : (
          <>
            <View style={styles.centerContainer}>
              <Spinning clockwise>
                <BigSpinner />
              </Spinning>
              {wcContext.dappInfo ? (
                <>
                  <LText semiBold style={styles.peerName}>
                    {wcContext.dappInfo.name}
                  </LText>
                  <LText primary style={styles.details}>
                    is connecting, please wait...
                  </LText>
                </>
              ) : null}
            </View>
          </>
        )}
      </View>
      {wcContext.status === STATUS.CONNECTING && wcContext.approveSession ? (
        <View style={styles.buttonsContainer}>
          <Button
            containerStyle={styles.buttonContainer}
            type="secondary"
            title="Reject"
            onPress={() => {
              wcContext.disconnect();
              navigation.goBack();
            }}
          />
          <Button
            containerStyle={styles.buttonContainer}
            type="primary"
            title="Connect"
            onPress={() => {
              wcContext.approveSession();
            }}
          />
        </View>
      ) : wcContext.status === STATUS.CONNECTED ? (
        <View style={styles.buttonsContainer}>
          <Button
            containerStyle={styles.buttonContainer}
            type="primary"
            title="Disconnect"
            onPress={() => {
              wcContext.disconnect();
              navigation.goBack();
            }}
            IconLeft={Disconnect}
          />
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    justifyContent: "center",
    backgroundColor: "white",
    flex: 1,
  },
  centerContainer: {
    alignItems: "center",
  },
  messagesContainer: {
    marginHorizontal: 16,
    marginTop: 32,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 214,
    marginBottom: 24,
  },
  buttonsContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  dottedLineContainer: {
    width: 54,
    height: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  accountContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(20, 37, 51, 0.1)",
    borderRadius: 4,
    marginHorizontal: 16,
  },
  accountTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 19,
    justifyContent: "center",
  },
  dot: {
    height: 3,
    width: 3,
    borderRadius: 3,
    backgroundColor: "rgba(20, 37, 51, 0.2)",
  },
  buttonContainer: {
    flex: 1,
    margin: 8,
  },
  textStyle: {
    color: "black",
  },
  logo: {
    width: 64,
    height: 64,
  },
  peerName: {
    fontSize: 18,
    lineHeight: 22,
  },
  details: {
    opacity: 0.5,
    textAlign: "center",
  },
  infos: {
    marginVertical: 24,
    marginHorizontal: 16,
  },
  accountName: {
    marginLeft: 11,
    fontSize: 16,
  },
  messagesSeparator: {
    height: 16,
  }
});
