#!/bin/bash

# To anyone reading this Feel free to improve on this if you can
cat <<EOF
// @flow

import React, { Component } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-navigation";
import LText from "../components/LText";
import colors from "../colors";
EOF

# Create the imports
find src/icons/ -type f -name '*.js' | while read f; do
   filename=$(basename -- "$f")
   u=`printf $filename|cut -c1|tr "[a-z]" "[A-Z]"`
   l=`printf $filename|cut -c2-`
   filename=$u$l
   printf "import ${filename%%.*} from \"$f\";" | sed 's,//,/,g;s,src,..,g;s,.js,,g'
done

cat << EOF

/* THIS FILE IS GENERATED, DO NOT EDIT */
class DebugSVG extends Component<{}> {
      static navigationOptions = {
    title: "Debug Svg Icons",
  };

  icons = (): Array<Object> =>
    [
EOF

find src/icons/ -type f -name '*.js' | while read f; do
   filename=$(basename -- "$f")
   u=`printf $filename|cut -c1|tr "[a-z]" "[A-Z]"`
   l=`printf $filename|cut -c2-`
   filename=$u$l
   warn=0
   if grep --quiet -E 'png|jpg|jpeg' $f; then
     warn=1
   fi
   echo "      {'name':\"${filename%%.*}\", 'bitmap': ${warn}, 'component':${filename%%.*}},"
done

cat << EOF
].sort((c1,c2)=> c1.name>c2.name? -1 : 1);

  render() {
    return (
      <SafeAreaView style={styles.root}>
        <ScrollView>
          <View style={styles.wrapper}>
            {this.icons().map(iconObj => (
              <View style={[styles.card, iconObj.bitmap && styles.bitmap]} key={iconObj.name}>
                <iconObj.component />
                <LText style={styles.text}>{iconObj.name}</LText>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  wrapper:{
    flexDirection:"row",
    flexWrap: "wrap"
  },
  card: {
    alignItems: "center",
    padding: 16,
    borderWidth:0.5,
    borderColor:colors.lightFog,
    flexGrow:1,
    justifyContent:"flex-end"
  },
  bitmap: {
    borderColor:colors.alert,
  },
  text: {
    padding: 4,
    textAlign: "center",
  },
});

export default DebugSVG;
EOF
