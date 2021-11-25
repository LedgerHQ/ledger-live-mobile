// @flow
import React, { useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";

type Props = {
  title: String,
  description: String
};

export default function NotFound({ title, description }: Props) {
  return (
    <View>
      <View style={styles.container}>
        <Image
          source={require("../../images/notFound.png")}
          style={styles.notFound}
        />
        <Text style={styles.bigString}>
          {title}
        </Text>
        <Text style={styles.description}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    paddingHorizontal: 30,
  },
  notFound: {
    alignSelf: "center",
    width: 80,
    height: 80,
  },
  bigString: {
    paddingVertical: 20,
    textAlign: "center",
    fontWeight: "500",
    fontSize: 20,
  },
  description: {
    textAlign: "center",
    color: "#14253350",
    fontSize: 15,
  },
});
