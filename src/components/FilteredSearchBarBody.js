// @flow
import React, { PureComponent } from "react";
import { StyleSheet, View, TouchableOpacity, Button, Text, ScrollView } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { withTranslation } from "react-i18next";
import { compose } from "redux";
import SearchIcon from "../icons/Search";
import Search from "./Search";
import TextInput from "./TextInput";
import getFontStyle from "./LText/getFontStyle";
import BottomSelectSheet from "./BottomSelectSheet";

import type { T } from "../types/common";
import { withTheme } from "../colors";

const SORT_OPTIONS = [
  "Rank",
  "% Change",
  "Market cap",
  "Price",
  "Name"
];

const CHANGE_TIMES = [
  { name: "Last 24 hours", short: "24H" },
  { name: "Last 7 days", short: "7D" },
  { name: "Last 1 year", short: "1Y" }
];

const CURRENCIES = [
  "BTC",
  "USD",
  "EUR",
  "CAD",
  "INR",
  "GBP"
];

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
    query: "",
    starred: false,
    activeOptions: [],
    checkDirection: false
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

  onClickStarred = () => this.setState({ starred: !this.state.starred });

  onClickSortBy = () => {
    this.setState({ activeOptions: SORT_OPTIONS, checkDirection: true });
    this.RBSheet.open();
  };

  onClickChangeTime = () => {
    this.setState({ activeOptions: CHANGE_TIMES.map(element => element.name), 
      checkDirection: false });
    this.RBSheet.open();
  };

  onClickLiveCompatible = () => {
  };

  onClickCurrency = () => {
    this.setState({ activeOptions: CURRENCIES, checkDirection: false });
    this.RBSheet.open();
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
              {this.state.starred ? "☆" : "★"}
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
          <TouchableOpacity onPress={this.onClickCurrency} style={styles.button}>
            <Text style={styles.buttonValue}>
              {"USD"}
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
        <RBSheet
          ref={ref => { this.RBSheet = ref; }}
          height={300}
          openDuration={250}
        >
          <BottomSelectSheet 
            options={this.state.activeOptions} 
            checkDirection={this.state.checkDirection}
          />
        </RBSheet>
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
    borderRadius: 10,
    backgroundColor: "#272727",
    padding: 6,
    marginHorizontal: 10,
    flexDirection: "row",
  },
  buttonText: {
    color: "white",
    fontSize: 16
  },
  buttonValue: {
    color: "#bbb0ff",
    fontSize: 16
  }
});

// $FlowFixMe
const m: React$ComponentType<OwnProps> = compose(
  withTranslation(),
  withTheme,
)(FilteredSearchBarBody);

export default m;
