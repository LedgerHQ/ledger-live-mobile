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
for f in $(find ../src/icons/ -type f -name '*.js');
   do filename=$(basename -- "$f")
   u=`echo $filename|cut -c1|tr [a-z] [A-Z]`
   l=`echo $filename|cut -c2-`
   filename=$u$l
   echo "import ${filename%%.*} from \"$f\";" | sed 's,//,/,g;s,../src,..,g;s,.js,,g'
done

cat << EOF

class DebugSVG extends Component<{}> {
  static navigationOptions = {
    title: "Debug Svg Icons",
  };

  icons = (): Array<Object> =>
    [
EOF

for f in $(find ../src/icons/ -type f -name '*.js');
   do filename=$(basename -- "$f")
   u=`echo $filename|cut -c1|tr [a-z] [A-Z]`
   l=`echo $filename|cut -c2-`
   filename=$u$l
   echo "      {'name':\"${filename%%.*}\", 'component':${filename%%.*}},"
done

cat << EOF
].sort((c1,c2)=> c1.name>c2.name? -1 : 1);

  render() {
    return (
      <SafeAreaView style={styles.root}>
        <ScrollView>
          {this.icons().map(iconObj => (
            <View style={styles.card} key={iconObj.name}>
              <iconObj.component />
              <LText style={styles.text}>{iconObj.name}</LText>
            </View>
          ))}
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
  card: {
    alignItems: "center",
    padding: 16
  },
  text: {
    width:"100%",
    padding:4,
    textAlign:"center",
  }
});

export default DebugSVG;
EOF