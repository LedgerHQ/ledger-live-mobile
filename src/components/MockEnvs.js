/* eslint-disable no-console */
// @flow

import React, { Component, useCallback } from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { withNavigation, SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import Config from "react-native-config";
import LText from "./LText";
import type { MockData } from "../mocks";
import data, { toJSON } from "../mocks";
import Touchable from "./Touchable";
import { flushAll } from "./DBSave";
import { RebootContext } from "../context/Reboot";

class Screen extends Component<{
  dispatch: (*) => any,
  reboot: () => any,
  state: *,
}> {
  static navigationOptions = {
    title: "Mock Envs",
  };

  resetApp = async (item: MockData) => {
    await this.props.dispatch({ type: "MOCK_INJECT_ITEM", item });
    await flushAll();
    await this.props.reboot();
  };

  renderItem = ({ item }: { item: MockData }) => (
    <Touchable
      style={{ padding: 20, marginVertical: 10, backgroundColor: "white" }}
      onPress={() => this.resetApp(item)}
      event="MockEnvItem"
    >
      <LText style={{ fontSize: 22 }} bold>
        {item.name}
      </LText>
    </Touchable>
  );

  keyExtractor = (item: MockData, index: number) => String(index);

  logCurrent = () => {
    console.log(
      "Copy-Paste this JSON into a new src/mocks/*.json (and give a better .name)\n\n\n",
    );
    console.log(JSON.stringify(toJSON(this.props.state, "NONAME")));
    console.log("\n\n\n");
  };

  ListHeaderComponent = () => (
    <Touchable
      style={{ padding: 20, marginVertical: 20, backgroundColor: "white" }}
      event="MockEnvsLogCurrent"
      onPress={this.logCurrent}
    >
      <LText style={{ fontSize: 16 }} bold>
        LOG CURRENT (check dev console)
      </LText>
    </Touchable>
  );

  render() {
    return (
      <FlatList
        style={styles.screen}
        ListHeaderComponent={this.ListHeaderComponent}
        data={data}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
      />
    );
  }
}

const ScreenConnected = connect(state => ({ state }))(Screen);

export class MockEnvsScreen extends Component<{}> {
  static navigationOptions = {
    title: "Mock Envs",
  };
  render() {
    if (!Config.MOCK) return null;
    return (
      <RebootContext.Consumer>
        {reboot => <ScreenConnected reboot={reboot} />}
      </RebootContext.Consumer>
    );
  }
}

export const MockEnvsAccessButton = withNavigation(({ navigation }) => {
  const onPress = useCallback(() => navigation.navigate("MockEnvs"), [
    navigation,
  ]);
  if (!Config.MOCK) return null;
  return (
    <SafeAreaView>
      <TouchableOpacity onPress={onPress} style={styles.root}>
        <LText bold style={styles.text}>
          ENVS
        </LText>
      </TouchableOpacity>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  root: {
    alignSelf: "center",
    backgroundColor: "blue",
    paddingHorizontal: 20,
  },
  text: {
    color: "white",
    textAlign: "center",
    paddingVertical: 10,
  },
});
