// @flow
import React, { PureComponent } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Button, Text, ScrollView } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { withTranslation } from "react-i18next";
import { compose } from "redux";
import Search from "./Search";
import SearchIcon from "../icons/Search";
import TextInput from "./TextInput";
import getFontStyle from "./LText/getFontStyle";
import BottomSelectSheet from "./BottomSelectSheet";
import BottomSelectSheetTF from "./BottomSelectSheetTF";
import FilterIcon from "../images/filter.png";

import type { T } from "../types/common";
import { withTheme } from "../colors";
import { ManagerFirmwareNotEnoughSpaceError } from "@ledgerhq/errors";

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
    const { query, focused } = this.state;

    return (
      <>
        <View flexDirection={"row"}>
          <TouchableOpacity
            onPress={query ? null : this.focusInput}
            style={[styles.wrapper, inputWrapperStyle]}
          >
            <View style={styles.iconContainer}>
              <SearchIcon
                size={20}
                color={"black"}
              />
            </View>
            <TextInput
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              onChangeText={this.onChange}
              onInputCleared={this.clear}
              placeholder={t("common.search")}
              placeholderTextColor={"#666666"}
              style={[styles.input, { color: colors.darkBlue }]}
              containerStyle={styles.inputContainer}
              value={query}
              ref={this.input}
              clearButtonMode="always"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn}>
            <Image source={FilterIcon} style={styles.filterIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.tfSelector}>
          <Text style={styles.tf}>
            Timeframe
          </Text>
          <TouchableOpacity style={{flexDirection: "row"}} onPress={this.onClickTimeFrame}>
            <Text style={styles.tfItem}>
              {"  Last 24 hours "}
            </Text>
            <Text style={styles.tfIcon}>
              {" ˅ "}
            </Text>
          </TouchableOpacity>
        </View>
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
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    height: 40,
    paddingVertical: 0,
    paddingLeft: 15,
    paddingRight: 10
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
  tfSelector: {
    flexDirection: "row",
    paddingTop: 15
  },
  tf: {
    fontSize: 15,
    paddingLeft: 15
  },
  tfItem: {
    fontSize: 15,
    color: "#6490f1"
  },
  tfIcon: {
    fontSize: 20,
    color: "#6490f1"
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 5,
    borderColor: "#14253350",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    right: 15,
    marginLeft: 5
  },
  filterIcon: {
    alignSelf: "center",
    width: "60%",
    height: "60%",
    marginBottom: 0
  }
});

// $FlowFixMe
const m: React$ComponentType<OwnProps> = compose(
  withTranslation(),
  withTheme,
)(FilteredSearchBarBody);

export default m;
