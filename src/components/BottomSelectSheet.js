// @flow

import React, { useState } from "react";
import { RectButton } from "react-native-gesture-handler";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { isWithinInterval } from "date-fns";

type Props = {
  title: String,
  options: any[],
  checkDirection: Boolean
};

export default function BottomSelectSheet({ title, options, checkDirection }: Props) {
  const [activeItem, setActiveItem] = useState("");
  const [activeFlag, setActiveFlag] = useState(false);
  const ItemRow = ({option}) => {
    return (
      <TouchableOpacity style={styles.itemRow} onPress={() => setActiveItem(option)}>
        <Text style={styles.itemText}>{option}</Text>
        {(option === activeItem) && (<View style={styles.right}>
          {checkDirection && (<>
            <TouchableOpacity style={activeFlag ? styles.circle : styles.circleUnactive}
            onPress={() => setActiveFlag(true)}>
              <Text style={activeFlag ? styles.itemTextSort : styles.itemTextSortUnactive}>
                ↑
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={!activeFlag ? styles.circle : styles.circleUnactive}
            onPress={() => setActiveFlag(false)}>
              <Text style={!activeFlag ? styles.itemTextSort : styles.itemTextSortUnactive}>
                ↓
              </Text>
            </TouchableOpacity>
          </>)}
          <Text style={styles.itemTextCheck}>
            ✓
          </Text>
        </View>)}
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.root}>
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
    paddingBottom: 5,
    color: "white"
  },
  itemRow: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingLeft: 20
  },
  circle: {
    borderRadius: 100,
    borderColor: "#bbb0ff",
    borderWidth: 1,
    marginLeft: 10
  },
  circleUnactive: {
    borderRadius: 100,
    borderColor: "white",
    borderWidth: 1,
    marginLeft: 10
  },
  itemText: {
    color: "white",
    fontSize: 15,
    paddingVertical: 3
  },
  itemTextSort: {
    color: "#bbb0ff",
    fontSize: 15,
    paddingVertical: 3,
    paddingHorizontal: 6
  },
  itemTextSortUnactive: {
    color: "white",
    fontSize: 15,
    paddingVertical: 3,
    paddingHorizontal: 6
  },
  itemTextCheck: {
    color: "#bbb0ff",
    fontSize: 15,
    paddingHorizontal: 20
  },
  right: {
    flexDirection: "row",
    marginLeft: "auto"
  },
  applyBtn: {
    backgroundColor: "white",
    borderRadius: 50,
    fontSize: 1000,
    width: "80%",
    marginTop: 20,
    alignSelf: "center"
  },
  applyText: {
    fontSize: 15,
    paddingVertical: 8,
    textAlign: "center"
  }
});
