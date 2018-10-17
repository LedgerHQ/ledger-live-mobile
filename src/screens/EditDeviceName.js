// @flow

import React, { Component } from "react";
import { TextInput, View, StyleSheet } from "react-native";
import type { NavigationScreenProp } from "react-navigation";
import Icon from "react-native-vector-icons/dist/Feather";
import TransportBLE from "../react-native-hw-transport-ble";
import editDeviceName from "../logic/hw/editDeviceName";
import Button from "../components/Button";
import LText from "../components/LText";
import TranslatedError from "../components/TranslatedError";
import colors from "../colors";

export default class EditDeviceName extends Component<
  {
    navigation: NavigationScreenProp<*>,
  },
  {
    name: string,
    error: ?Error,
  },
> {
  static navigationOptions = {
    title: "Edit Device Name",
  };

  state = {
    name: this.props.navigation.getParam("device").name,
    error: null,
  };

  onChangeText = (name: string) => {
    this.setState({ name });
  };

  onSubmit = async () => {
    const { name } = this.state;
    const device = this.props.navigation.getParam("device");
    if (device.name !== name) {
      try {
        const transport = await TransportBLE.open(device);
        await editDeviceName(transport, name);
        transport.close();
      } catch (error) {
        console.warn(error);
        this.setState({ error });
        return;
      }
    }
    this.props.navigation.goBack();
  };

  render() {
    const { name, error } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <TextInput
            value={name}
            onChangeText={this.onChangeText}
            style={{ padding: 10 }}
          />
        </View>
        <View style={styles.footer}>
          {error ? (
            <LText style={styles.error} numberOfLines={2}>
              <Icon color={colors.alert} size={16} name="alert-triangle" />{" "}
              <TranslatedError error={error} />
            </LText>
          ) : null}
          <Button type="primary" title="Change name" onPress={this.onSubmit} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  body: {},
  error: {
    alignSelf: "center",
    color: colors.alert,
    fontSize: 14,
    marginBottom: 10,
  },
  footer: {
    flexDirection: "column",
    padding: 20,
  },
});
