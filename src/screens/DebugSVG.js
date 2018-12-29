// @flow

import React, { Component } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-navigation";
import LText from "../components/LText";
import colors from "../colors";
import FaceID from "../icons/FaceID";
import Wrench from "../icons/Wrench";
import ExternalLink from "../icons/ExternalLink";
import LiveLogoIcon from "../icons/LiveLogoIcon";
import FaceIDFailed from "../icons/FaceIDFailed";
import Send from "../icons/Send";
import Fingerprint from "../icons/Fingerprint";
import DeviceNanoMedium from "../icons/DeviceNanoMedium";
import QRcode from "../icons/QRcode";
import ArrowRight from "../icons/ArrowRight";
import Display from "../icons/Display";
import Truck from "../icons/Truck";
import SettingsIcon from "../icons/SettingsIcon";
import Warning from "../icons/Warning";
import LiveLogo from "../icons/LiveLogo";
import Exchange from "../icons/Exchange";
import DeviceNanoAction from "../icons/DeviceNanoAction";
import CheckCircle from "../icons/CheckCircle";
import TabNanoX from "../icons/TabNanoX";
import Import from "../icons/Import";
import AlertTriangle from "../icons/AlertTriangle";
import NanoSVertical from "../icons/NanoSVertical";
import PortfolioNoOpIllustration from "../icons/PortfolioNoOpIllustration";
import Accounts from "../icons/Accounts";
import Paybis from "../icons/logos/paybis";
import Changelly from "../icons/logos/changelly";
import Coinmama from "../icons/logos/coinmama";
import Shapeshift from "../icons/logos/shapeshift";
import Coinhouse from "../icons/logos/coinhouse";
import Changenow from "../icons/logos/changenow";
import Genesis from "../icons/logos/genesis";
import Thorswap from "../icons/logos/thorswap";
import Kyber from "../icons/logos/kyber";
import Simplex from "../icons/logos/simplex";
import Kyberswap from "../icons/logos/kyberswap";
import Luno from "../icons/logos/luno";
import NanoXHorizontalBig from "../icons/NanoXHorizontalBig";
import Receive from "../icons/Receive";
import Check from "../icons/Check";
import Close from "../icons/Close";
import Help from "../icons/Help";
import DeviceIconBack from "../icons/DeviceIconBack";
import Info from "../icons/Info";
import QRcodeZoom from "../icons/QRcodeZoom";
import PhoneBle from "../icons/PhoneBle";
import FallbackCamera from "../icons/FallbackCamera";
import NanoX from "../icons/NanoX";
import NanoXVertical from "../icons/NanoXVertical";
import TouchID from "../icons/TouchID";
import ArrowLeft from "../icons/ArrowLeft";
import Confetti3 from "../icons/confetti/confetti3";
import Confetti2 from "../icons/confetti/confetti2";
import Confetti1 from "../icons/confetti/confetti1";
import Confetti4 from "../icons/confetti/confetti4";
import Wallet from "../icons/Wallet";
import RecoveryPhrase from "../icons/RecoveryPhrase";
import Alert from "../icons/Alert";
import History from "../icons/History";
import Manager from "../icons/Manager";
import ImportDesktopAccounts from "../icons/ImportDesktopAccounts";
import NoLocationImage from "../icons/NoLocationImage";
import EmptyAccountsIllustration from "../icons/EmptyAccountsIllustration";
import ArrowUp from "../icons/ArrowUp";
import Portfolio from "../icons/Portfolio";
import Blue from "../icons/Blue";
import DeviceIconCheck from "../icons/DeviceIconCheck";
import Transfer from "../icons/Transfer";
import Trash from "../icons/Trash";
import Location from "../icons/Location";
import LedgerLogoRec from "../icons/LedgerLogoRec";
import Search from "../icons/Search";
import Archive from "../icons/Archive";
import ArrowDown from "../icons/ArrowDown";
import Settings from "../icons/Settings";
import Assets from "../icons/Assets";
import Pause from "../icons/Pause";

class DebugSVG extends Component<{}> {
  static navigationOptions = {
    title: "Debug Svg Icons",
  };

  icons = (): Array<Object> =>
    [
      { name: "FaceID", component: FaceID },
      { name: "Wrench", component: Wrench },
      { name: "ExternalLink", component: ExternalLink },
      { name: "LiveLogoIcon", component: LiveLogoIcon },
      { name: "FaceIDFailed", component: FaceIDFailed },
      { name: "Send", component: Send },
      { name: "Fingerprint", component: Fingerprint },
      { name: "DeviceNanoMedium", component: DeviceNanoMedium },
      { name: "QRcode", component: QRcode },
      { name: "ArrowRight", component: ArrowRight },
      { name: "Display", component: Display },
      { name: "Truck", component: Truck },
      { name: "SettingsIcon", component: SettingsIcon },
      { name: "Warning", component: Warning },
      { name: "LiveLogo", component: LiveLogo },
      { name: "Exchange", component: Exchange },
      { name: "DeviceNanoAction", component: DeviceNanoAction },
      { name: "CheckCircle", component: CheckCircle },
      { name: "TabNanoX", component: TabNanoX },
      { name: "Import", component: Import },
      { name: "AlertTriangle", component: AlertTriangle },
      { name: "NanoSVertical", component: NanoSVertical },
      {
        name: "PortfolioNoOpIllustration",
        component: PortfolioNoOpIllustration,
      },
      { name: "Accounts", component: Accounts },
      { name: "Paybis", component: Paybis },
      { name: "Changelly", component: Changelly },
      { name: "Coinmama", component: Coinmama },
      { name: "Shapeshift", component: Shapeshift },
      { name: "Coinhouse", component: Coinhouse },
      { name: "Changenow", component: Changenow },
      { name: "Genesis", component: Genesis },
      { name: "Thorswap", component: Thorswap },
      { name: "Kyber", component: Kyber },
      { name: "Simplex", component: Simplex },
      { name: "Kyberswap", component: Kyberswap },
      { name: "Luno", component: Luno },
      { name: "NanoXHorizontalBig", component: NanoXHorizontalBig },
      { name: "Receive", component: Receive },
      { name: "Check", component: Check },
      { name: "Close", component: Close },
      { name: "Help", component: Help },
      { name: "DeviceIconBack", component: DeviceIconBack },
      { name: "Info", component: Info },
      { name: "QRcodeZoom", component: QRcodeZoom },
      { name: "PhoneBle", component: PhoneBle },
      { name: "FallbackCamera", component: FallbackCamera },
      { name: "NanoX", component: NanoX },
      { name: "NanoXVertical", component: NanoXVertical },
      { name: "TouchID", component: TouchID },
      { name: "ArrowLeft", component: ArrowLeft },
      { name: "Confetti3", component: Confetti3 },
      { name: "Confetti2", component: Confetti2 },
      { name: "Confetti1", component: Confetti1 },
      { name: "Confetti4", component: Confetti4 },
      { name: "Wallet", component: Wallet },
      { name: "RecoveryPhrase", component: RecoveryPhrase },
      { name: "Alert", component: Alert },
      { name: "History", component: History },
      { name: "Manager", component: Manager },
      { name: "ImportDesktopAccounts", component: ImportDesktopAccounts },
      { name: "NoLocationImage", component: NoLocationImage },
      {
        name: "EmptyAccountsIllustration",
        component: EmptyAccountsIllustration,
      },
      { name: "ArrowUp", component: ArrowUp },
      { name: "Portfolio", component: Portfolio },
      { name: "Blue", component: Blue },
      { name: "DeviceIconCheck", component: DeviceIconCheck },
      { name: "Transfer", component: Transfer },
      { name: "Trash", component: Trash },
      { name: "Location", component: Location },
      { name: "LedgerLogoRec", component: LedgerLogoRec },
      { name: "Search", component: Search },
      { name: "Archive", component: Archive },
      { name: "ArrowDown", component: ArrowDown },
      { name: "Settings", component: Settings },
      { name: "Assets", component: Assets },
      { name: "Pause", component: Pause },
    ].sort((c1, c2) => (c1.name > c2.name ? -1 : 1));

  render() {
    return (
      <SafeAreaView style={styles.root}>
        <ScrollView>
          <View style={styles.wrapper}>
            {this.icons().map(iconObj => (
              <View style={styles.card} key={iconObj.name}>
                <iconObj.component />
                <LText style={styles.text}>{iconObj.name}</LText>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  wrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  card: {
    alignItems: "center",
    padding: 16,
    borderWidth: 0.5,
    borderColor: colors.lightFog,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  text: {
    padding: 4,
    textAlign: "center",
  },
});

export default DebugSVG;
