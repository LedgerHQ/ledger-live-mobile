/* @flow */
import React, { Component } from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import colors from "../colors";

export default class ScreenGeneric extends Component<{
  renderHeader: (props: *) => *,
  children: *
}> {
  render() {
    const { children, renderHeader } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.header}>{renderHeader(this.props)}</View>
        <ScrollView bounces={false} style={styles.body}>
          {children}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    height: 70,
    paddingTop: 20,
    backgroundColor: colors.blue
  },
  body: {
    flex: 1
  }
});
