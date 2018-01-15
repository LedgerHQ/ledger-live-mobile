/* @flow */
import React, { Component } from "react";
import { Image, View, StyleSheet } from "react-native";
import colors from "../colors";

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    justifyContent: "center",
    padding: 4
  },
  view: {
    backgroundColor: colors.blue,
    paddingVertical: 0,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    tintColor: "#fff",
    width: 32,
    height: 32
  }
});

export default class Create extends Component<*> {
  static navigationOptions = {
    tabBarIcon: ({ tintColor }: *) => (
      <View style={styles.root}>
        <View style={styles.view}>
          <Image
            source={require("../images/create.png")}
            style={styles.image}
          />
        </View>
      </View>
    ),
    tabBarOnPress: (props: *) => {
      console.log("TODO: trigger the modal!", props);
    }
  };

  render() {
    return null;
  }
}
