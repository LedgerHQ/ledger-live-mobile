// @flow
import React, { PureComponent, Fragment } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { withTranslation } from "react-i18next";

import SearchIcon from "../icons/Search";
import Search from "./Search";
import TextInput from "./TextInput";
import getFontStyle from "./LText/getFontStyle";

import colors from "../colors";
import type { T } from "../types/common";

type Props = {
  renderList: (list: Array<*>) => React$Node,
  renderEmptySearch: () => React$Node,
  keys?: string[],
  list: Array<*>,
  inputWrapperStyle?: *,
  t: T,
};

type State = {
  focused: boolean,
  query: string,
};

class FilteredSearchBar extends PureComponent<Props, State> {
  static defaultProps = {
    keys: ["name"],
  };

  state = {
    focused: false,
    query: "",
  };

  input = React.createRef();

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
    } = this.props;
    const { query, focused } = this.state;

    return (
      <Fragment>
        <TouchableOpacity
          onPress={query ? null : this.focusInput}
          style={[styles.wrapper, inputWrapperStyle]}
        >
          <View style={styles.iconContainer}>
            <SearchIcon
              size={20}
              color={focused ? colors.darkBlue : colors.grey}
            />
          </View>
          <TextInput
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            onChangeText={this.onChange}
            onInputCleared={this.clear}
            placeholder={t("common.search")}
            placeholderTextColor={colors.grey}
            style={styles.input}
            containerStyle={styles.inputContainer}
            value={query}
            ref={this.input}
            clearButtonMode="always"
          />
        </TouchableOpacity>
        <Search
          fuseOptions={{
            threshold: 0.1,
            keys,
          }}
          value={query}
          items={list}
          render={renderList}
          renderEmptySearch={renderEmptySearch}
        />
      </Fragment>
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
    color: colors.darkBlue,
    paddingVertical: 0,
    ...getFontStyle({ secondary: true, semiBold: true }),
  },
  inputContainer: {
    flex: 1,
  },
});

export default withTranslation()(FilteredSearchBar);
