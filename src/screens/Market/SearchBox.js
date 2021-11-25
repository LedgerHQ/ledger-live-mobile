// @flow
import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import SearchIcon from "../../icons/Search";
import TextInput from "../../components/TextInput";
import getFontStyle from "../../components/LText/getFontStyle";

type Props = {
  onChangeFlag: ((String) => void),
};

export default function SearchBox({ onChangeFlag }: Props) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const onFocus = () => setFocused(true);

  const onBlur = () => setFocused(false);

  const onChange = text => {
    setQuery(text);
    onChangeFlag(text);
  }

  const clear = () => setQuery("");

  const focusInput = () => {};

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={query ? null : focusInput}
        style={[styles.wrapper]}
      >
        <View style={styles.iconContainer}>
          <SearchIcon size={20} color={"black"} />
        </View>
        <TextInput
          onBlur={onBlur}
          onFocus={onFocus}
          onChangeText={onChange}
          onInputCleared={clear}
          focused={focused}
          placeholder={"Search"}
          placeholderTextColor={"#666666"}
          style={[styles.input, { color: "#003366" }]}
          containerStyle={styles.inputContainer}
          value={query}
          clearButtonMode="always"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 8,
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    height: 40,
    paddingLeft: 15,
    paddingRight: 10,
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
});
