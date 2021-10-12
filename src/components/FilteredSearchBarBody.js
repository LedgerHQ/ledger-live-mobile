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
import BottomSelectSheetTF from "./BottomSelectSheetTF";

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
  { name: "1 day", short: "24H" },
  { name: "1 week", short: "1W" },
  { name: "1 month", short: "1M" },
  { name: "1 year", short: "1Y" }
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
    styleSheetTitle: "",
    activeOptions: [],
    checkDirection: false,
    showTimeframeSelector: true
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
    this.setState({
      styleSheetTitle: "SORT BY",
      activeOptions: SORT_OPTIONS,
      checkDirection: true
    });
    this.RBSheet.open();
  };

  onClickTimeFrame = () => {
    this.setState({
      styleSheetTitle: "Timeframe",
      activeOptions: CHANGE_TIMES.map(element => element.name),
      checkDirection: false
    });
    this.RBSheetTimeFrame.open();
    // this.setState({
    //   showTimeframeSelector: true
    // });
  };

  onClickLiveCompatible = () => {
  };

  onClickCurrency = () => {
    this.setState({
      styleSheetTitle: "CURRENCY",
      activeOptions: CURRENCIES,
      checkDirection: false
    });
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
      colors
    } = this.props;
    const { query, focused, showTimeframeSelector } = this.state;

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
          <TouchableOpacity onPress={this.onClickTimeFrame} style={styles.button}>
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
        {showTimeframeSelector && (
          <View style={styles.tfSelector}>
            <Text style={styles.tf}>
              Timeframe
            </Text>
            <TouchableOpacity style={{flexDirection: "row"}} onPress={this.onClickTimeFrame}>
              <Text style={styles.tfItem}>
                {"  Last 24 hours "}
              </Text>
              <Text style={styles.tfIcon}>
                {" ˅"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
          height={350}
          openDuration={250}
          closeOnDragDown
          customStyles={{
            container: {
              backgroundColor: "#191919"
            }
          }}
        >
          <BottomSelectSheet
            title={this.state.styleSheetTitle}
            options={this.state.activeOptions} 
            checkDirection={this.state.checkDirection}
          />
        </RBSheet>
        <RBSheet
          ref={ref => { this.RBSheetTimeFrame = ref; }}
          height={350}
          openDuration={250}
          closeOnDragDown
          customStyles={{
            container: {
              backgroundColor: "#ffffff",
              borderRadius: 20
            },
            draggableIcon: {
              backgroundColor: "#14253320",
              width: 40
            },
            wrapper: {
              color: "#142533",
              fontFamily: "Inter"
            }
          }}
        >
          <BottomSelectSheetTF
            title={this.state.styleSheetTitle}
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
  },
  tfSelector: {
    flexDirection: "row",
    paddingTop: 15
  },
  tf: {
    fontSize: 15
  },
  tfItem: {
    fontSize: 15,
    color: "#6490f1"
  },
  tfIcon: {
    fontSize: 20,
    color: "#6490f1"
  }
});

// $FlowFixMe
const m: React$ComponentType<OwnProps> = compose(
  withTranslation(),
  withTheme,
)(FilteredSearchBarBody);

export default m;
