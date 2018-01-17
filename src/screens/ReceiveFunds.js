/* @flow */
import React, { Component } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  findNodeHandle
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import colors from "../colors";
import QRCodePreview from "../components/QRCodePreview";
import QRCodeModal from "../modals/QRCodeAddress";

export default class ReceiveFunds extends Component<*, *> {
  static navigationOptions = {
    title: "Receive Funds"
  };
  state = {
    qrCodeModalOpened: false
  };
  viewHandle: ?*;
  onRef = (ref: *) => {
    this.viewHandle = findNodeHandle(ref);
  };
  openQRCodeModal = () => {
    this.setState({ qrCodeModalOpened: true });
  };
  closeQRCodeModal = () => {
    this.setState({ qrCodeModalOpened: false });
  };
  render() {
    const { qrCodeModalOpened } = this.state;
    const address = "1gre1noAY9HiK2qxoW8FzSdjdFBcoZ5fV";
    return (
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.content}
        ref={this.onRef}
        bounces={false}
      >
        <Text style={{ color: "white", fontWeight: "bold", margin: 10 }}>
          Choose account
        </Text>

        <View
          style={{
            width: 300,
            height: 50,
            backgroundColor: "white",
            marginBottom: 10
          }}
        />

        <Text style={{ color: "white", fontWeight: "bold", margin: 10 }}>
          Request amount (optional)
        </Text>

        <View
          style={{
            width: 300,
            height: 50,
            marginBottom: 40,
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <View
            style={{
              width: 120,
              height: 50,
              backgroundColor: "white"
            }}
          />
          <View
            style={{
              width: 120,
              height: 50,
              backgroundColor: "white"
            }}
          />
        </View>

        <TouchableOpacity onPress={this.openQRCodeModal}>
          <QRCodePreview address={address} />
        </TouchableOpacity>

        <View />

        <Text style={{ color: "white", fontWeight: "bold", marginTop: 30 }}>
          Current address
        </Text>
        <View
          style={{
            // FIXME this should be a component
            padding: 10,
            margin: 10,
            backgroundColor: "rgba(255,255,255,0.1)",
            borderWidth: 1,
            borderColor: "white",
            borderStyle: "dashed"
          }}
        >
          <Text style={{ color: "white" }}>{address}</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: 40,
              height: 40,
              margin: 10,
              backgroundColor: "white",
              borderRadius: 8
            }}
          />
          <View
            style={{
              width: 40,
              height: 40,
              margin: 10,
              backgroundColor: "white",
              borderRadius: 8
            }}
          />
          <View
            style={{
              width: 40,
              height: 40,
              margin: 10,
              backgroundColor: "white",
              borderRadius: 8
            }}
          />
        </View>

        {qrCodeModalOpened ? (
          <QRCodeModal
            viewRef={this.viewHandle}
            address={address}
            onRequestClose={this.closeQRCodeModal}
          />
        ) : null}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.blue,
    flex: 1
  },
  content: {
    alignItems: "center",
    justifyContent: "center"
  }
});
