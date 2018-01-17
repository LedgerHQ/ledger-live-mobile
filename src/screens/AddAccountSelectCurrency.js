/* @flow */
import React, { Component } from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Image,
  Button
} from "react-native";
import colors from "../colors";
import HeaderRightClose from "../components/HeaderRightClose";
import BlueButton from "../components/BlueButton";

export default class AddAccountSelectCurrency extends Component<*> {
  static navigationOptions = ({ navigation }: *) => ({
    title: "Add an account",
    headerRight: <HeaderRightClose navigation={navigation} />
  });
  onSelect = () => {
    const { navigation } = this.props;
    navigation.navigate("AddAccountInfo", {
      currency: "bitcoin"
    });
  };
  render() {
    return (
      <View style={styles.root}>
        <View style={{ flex: 1 }} />
        <BlueButton onPress={this.onSelect} title="Confirm" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  }
});
