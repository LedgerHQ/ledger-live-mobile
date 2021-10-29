// @flow

import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

type Props={
  title: String,
  options: Array<Object>,
  active: Object,
  onApply: (Object) => void
}

export default function BottomSelectSheetTF({ title, options, active, onApply }: Props) {
  const [activeItem, setActiveItem] = useState(active);
  const ItemRow = ({option, isActive}) => {
    return (
      <TouchableOpacity style={styles.itemRow} onPress={() => {setActiveItem(option)}}>
        <Text style={isActive ? styles.boldItemText : styles.itemText}>{option.name}</Text>
        {isActive && (
          <Text style={styles.itemTextCheck}>
            ✓
          </Text>
        )}
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.root}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.filterList}>
        {options.map((option, id) => {
          return <ItemRow option={option} isActive={option===activeItem} key={id}/>
        })}
      </View>
      <TouchableOpacity onPress={() => {onApply(activeItem)}} style={styles.applyBtn}>
        <Text style={styles.applyText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
  },
  filterList: {
    marginHorizontal: 25,
    paddingVertical: 10,
    borderBottomColor: "#eeeeee"
  },
  title: {
    textAlign: 'center',
    fontSize: 25,
    paddingTop: 10,
    paddingBottom: 5
  },
  itemRow: {
    flexDirection: "row",
    paddingVertical: 5
  },
  itemText: {
    fontSize: 15,
    paddingVertical: 3
  },
  boldItemText: {
    fontSize: 15,
    paddingVertical: 3,
    fontWeight: "bold"
  },
  itemTextCheck: {
    color: "#6490f1",
    fontSize: 15,
    paddingHorizontal: 20,
    marginLeft: "auto"
  },
  applyBtn: {
    backgroundColor: "#6490f1",
    borderRadius: 0,
    width: "90%",
    marginTop: 20,
    alignSelf: "center"
  },
  applyText: {
    fontSize: 15,
    paddingVertical: 8,
    textAlign: "center",
    color: "white"
  }
});
