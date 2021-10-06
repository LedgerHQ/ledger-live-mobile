// @flow
import React, { PureComponent } from "react";
import { StyleSheet, View, TouchableOpacity, Button, Text, ScrollView } from "react-native";
import { withTranslation } from "react-i18next";
import { compose } from "redux";
import SearchIcon from "../icons/Search";
import Search from "./Search";
import TextInput from "./TextInput";
import getFontStyle from "./LText/getFontStyle";

import type { T } from "../types/common";
import { withTheme } from "../colors";

type OwnProps = {
  initialQuery?: string,
  renderList: (list: Array<*>) => React$Node,
  renderEmptySearch: () => React$Node,
  keys?: string[],
  list: Array<*>,
  inputWrapperStyle?: *,
};

type ConnectedProps = {|
  t: T,
  colors: *,
|};

type Props = {
  ...OwnProps,
  ...ConnectedProps,
};

type State = {
  focused: boolean,
  query: string,
};

class FilteredSearchBarBody extends PureComponent<Props, State> {
  static defaultProps = {
    keys: ["name"],
  };

  state = {
    focused: false,
    query: ""
  };

  input = React.createRef();

  componentDidMount() {
    if (this.props.initialQuery) this.onChange(this.props.initialQuery);
  }

  onFocus = () => this.setState({ focused: true });

  onBlur = () => this.setState({ focused: false });

  onChange = (text: string) => this.setState({ query: text });

  clear = () => this.setState({ query: "" });

  focusInput = () => {
    if (this.input.current) {
      this.input.current.focus();
    }
  };

  render() {
    const {
      keys,
      renderList,
      list,
      renderEmptySearch,
      inputWrapperStyle,
      t,
      colors,
    } = this.props;
    const { query, focused } = this.state;

    return (
      <>
        <ScrollView horizontal>
          <TouchableOpacity onPress={this.onClickStarred} style={styles.button}>
            <Text style={styles.buttonText}>
              {"☆"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onClickSortBy} style={styles.button}>
            <Text style={styles.buttonText}>
              {"Sort "}
            </Text>
            <Text style={styles.buttonValue}>
              {"Rank↑"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onClickChangeTime} style={styles.button}>
            <Text style={styles.buttonText}>
              {"% "}
            </Text>
            <Text style={styles.buttonValue}>
              {"(7D)"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onClickLiveCompatible} style={styles.button}>
            <Text style={styles.buttonText}>
              {"Live Compatible "}
            </Text>
            <Text style={styles.buttonValue}>
              {"Yes"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
        <Search
          fuseOptions={{
            threshold: 0.1,
            keys,
            shouldSort: false,
          }}
          value={query}
          items={list}
          render={renderList}
          renderEmptySearch={renderEmptySearch}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    ...getFontStyle({ secondary: true, semiBold: true }),
  },
  inputContainer: {
    flex: 1,
  },
  button: {
    fontSize: 15,
    borderRadius: 10,
    backgroundColor: "#272727",
    padding: 5,
    margin: 5,
    flexDirection: "row"
  },
  buttonText: {
    color: "white"
  },
  buttonValue: {
    color: "#bbb0ff"
  }
});

// $FlowFixMe
const m: React$ComponentType<OwnProps> = compose(
  withTranslation(),
  withTheme,
)(FilteredSearchBarBody);

export default m;
