// @flow

import React from "react";
import { RectButton } from "react-native-gesture-handler";
import { View, StyleSheet, Text } from "react-native";

type Props = {
  options: any[],
  checkDirection: Boolean
};

export default function BottomSelectSheet({ options, checkDirection }: Props) {
  const ItemRow = ({option}) => {
    return (
      <View style={{flexDirection: "row"}}>
        <Text>{option}</Text>
        {checkDirection ? <Text>UpDown</Text> : <></>}
      </View>
    )
  }

  return (
    <View>
      {options.map(option => {
        return <ItemRow option={option}/>
      })}
    </View>
  );
}

const styles = StyleSheet.create({
});
