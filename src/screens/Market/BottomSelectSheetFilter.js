// @flow

import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  filterOptions: Object,
  onApply: Object => void,
};

type ItemRowProps = {
  option: Object,
  active: Boolean,
  onPress: () => void,
};

type FilterListProps = {
  options: Array<Object>,
  id: Number,
};

export default function BottomSelectSheetFilter({
  filterOptions,
  onApply,
}: Props) {
  const [_filterOptions, setFilterOptions] = useState(filterOptions);
  const ItemRow = ({ option, active, onPress }: ItemRowProps) => (
    <TouchableOpacity style={styles.itemRow} onPress={onPress}>
      <Text style={active ? styles.boldItemText : styles.itemText}>
        {option}
      </Text>
      {active && <Text style={styles.itemTextCheck}>✓</Text>}
    </TouchableOpacity>
  );

  const FilterList = ({ options, id }: FilterListProps) => (
    <View style={[styles.filterList, { borderTopWidth: id === 0 ? 0 : 1 }]}>
      <Text style={styles.subTitle}>{options.title}</Text>
      {options.options.map((option, index) => (
        <ItemRow
          option={option.name}
          active={option.name === options.active}
          onPress={() => {
            const newFilterOptions = { ..._filterOptions };
            newFilterOptions[id].active = option.name;
            setFilterOptions(newFilterOptions);
          }}
          key={index}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.root}>
      {filterOptions.map((options, id) => (
        <FilterList options={options} id={id} key={id} />
      ))}
      <TouchableOpacity
        onPress={() => onApply(_filterOptions)}
        style={styles.applyBtn}
      >
        <Text style={styles.applyText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {},
  filterList: {
    marginHorizontal: 25,
    paddingVertical: 10,
    borderBottomColor: "#eeeeee",
  },
  subTitle: {
    textAlign: "left",
    fontSize: 12,
    paddingTop: 15,
    paddingBottom: 5,
  },
  itemRow: {
    flexDirection: "row",
    paddingVertical: 5,
  },
  itemText: {
    fontSize: 15,
    paddingVertical: 3,
  },
  boldItemText: {
    fontSize: 15,
    paddingVertical: 3,
    fontWeight: "bold",
  },
  itemTextCheck: {
    color: "#6490f1",
    fontSize: 15,
    paddingHorizontal: 20,
    marginLeft: "auto",
  },
  applyBtn: {
    backgroundColor: "#6490f1",
    borderRadius: 0,
    width: "90%",
    marginTop: 20,
    alignSelf: "center",
  },
  applyText: {
    fontSize: 15,
    paddingVertical: 8,
    textAlign: "center",
    color: "white",
  },
});
