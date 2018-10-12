// @flow

import React, { Component, PureComponent } from "react";
import { View, ActivityIndicator } from "react-native";
import type { NavigationScreenProp } from "react-navigation";
import TransportBLE from "../../react-native-hw-transport-ble";
import genuineCheck from "../../logic/hw/genuineCheck";
import LText from "../../components/LText";
import Button from "../../components/Button";
import TranslatedError from "../../components/TranslatedError";
import HeaderRightClose from "../../components/HeaderRightClose";

class Success extends PureComponent<*> {
  render() {
    const { device, onEdit, onDone } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <LText semiBold>SUCCESS</LText>
          <LText bold>{device.name}</LText>
          <Button type="tertiary" title="Edit" onPress={onEdit} />
        </View>
        <Button type="primary" title="Continue" onPress={onDone} />
      </View>
    );
  }
}

class ErrorCase extends PureComponent<*> {
  render() {
    const { error } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <LText>
            <TranslatedError error={error} />
          </LText>
        </View>
      </View>
    );
  }
}

class PendingCase extends PureComponent<*> {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <ActivityIndicator />
        </View>
      </View>
    );
  }
}

export default class PairDevicesStep3 extends Component<
  {
    navigation: NavigationScreenProp<*>,
  },
  {
    error: ?Error,
    pending: boolean,
  },
> {
  static navigationOptions = ({ navigation }: *) => ({
    title: "Pairing success",
    headerRight: (
      <HeaderRightClose navigation={navigation.dangerouslyGetParent()} />
    ),
  });

  state = {
    error: null,
    pending: true,
  };

  componentDidMount() {
    this.doEverything();
  }

  doEverything = async () => {
    const device = this.props.navigation.getParam("device");
    try {
      const transport = await TransportBLE.open(device);
      transport.setDebugMode(true);
      try {
        await genuineCheck(transport);
        this.setState({ pending: false });
      } finally {
        transport.close();
      }
    } catch (error) {
      this.setState({ error });
    }
  };

  onEdit = () => {
    const device = this.props.navigation.getParam("device");
    this.props.navigation.navigate("EditDeviceName", {
      device,
    });
  };

  onDone = () => {
    this.props.navigation.dangerouslyGetParent().goBack();
  };

  render() {
    const { navigation } = this.props;
    const { error, pending } = this.state;
    const device = navigation.getParam("device");
    if (error) {
      return <ErrorCase error={error} />;
    }
    if (pending) {
      return <PendingCase />;
    }
    return (
      <Success device={device} onEdit={this.onEdit} onDone={this.onDone} />
    );
  }
}
