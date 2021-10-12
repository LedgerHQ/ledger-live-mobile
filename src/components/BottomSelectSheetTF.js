// @flow

import React, { useState } from "react";
import { RectButton } from "react-native-gesture-handler";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { isWithinInterval } from "date-fns";
import { listCurrentRates } from "@ledgerhq/live-common/lib/families/ethereum/modules/compound";

type Props = {
  title: String,
  options: any[]
};

export default function BottomSelectSheetTF({ title, options }: Props) {
  const [activeItem, setActiveItem] = useState("");
  const [activeFlag, setActiveFlag] = useState(false);
  const ItemRow = ({option}) => {
    return (
      <TouchableOpacity style={styles.itemRow} onPress={() => setActiveItem(option)}>
        <Text style={styles.itemText}>{option}</Text>
        {(option === activeItem) && (
          <Text style={styles.itemTextCheck}>
            ✓
          </Text>
        )}
      </TouchableOpacity>
    )
  }
  const rates = listCurrentRates();

  return (
    <View style={styles.root}>
      <Text>{listCurrentRates()}</Text>
      <Text style={styles.title}>{title}</Text>
      {options.map(option => {
        return <ItemRow option={option}/>
      })}
      <TouchableOpacity onPress={() => {}} style={styles.applyBtn}>
        <Text style={styles.applyText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
  },
  title: {
    textAlign: 'center',
    fontSize: 25,
    paddingTop: 10,
    paddingBottom: 5
  },
  itemRow: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingLeft: 20
  },
  itemText: {
    fontSize: 15,
    paddingVertical: 3,
    paddingLeft: 10
  },
  itemTextCheck: {
    color: "#bbb0ff",
    fontSize: 15,
    paddingHorizontal: 20,
    marginLeft: "auto"
  },
  applyBtn: {
    backgroundColor: "#6490f1",
    borderRadius: 0,
    fontSize: 1000,
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
