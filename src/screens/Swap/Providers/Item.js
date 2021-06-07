// @flow

import React from "react";
import { useTheme } from "@react-navigation/native";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import LText from "../../../components/LText";
import BulletList, { BulletSmallDot } from "../../../components/BulletList";

const Item = ({
  id,
  selected,
  onSelect,
  Icon,
  title,
  bullets,
  kyc,
}: {
  id: string,
  selected?: string,
  onSelect: string => void,
  Icon: any,
  title: React$Node,
  bullets: Array<React$Node>,
  kyc?: boolean,
}) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={() => onSelect(id)}>
      <View
        style={[
          styles.wrapper,
          { borderColor: selected === id ? colors.live : colors.fog },
        ]}
      >
        <View style={styles.head}>
          <Icon size={32} />
          <LText style={styles.title} semiBold>
            {title}
          </LText>
        </View>
        <View style={styles.bullets}>
          <BulletList
            itemContainerStyle={styles.bullet}
            itemStyle={{
              paddingLeft: 6,
            }}
            Bullet={BulletSmallDot}
            list={bullets.map(wording => (
              <LText
                style={[styles.bulletText, { color: colors.smoke }]}
                semiBold
              >
                {wording}
              </LText>
            ))}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    marginLeft: 12,
  },
  bullets: {
    marginTop: 16,
  },
  bullet: {
    paddingVertical: 0,
    paddingBottom: 5,
  },
  bulletText: {
    fontSize: 13,
  },
});

export default Item;
