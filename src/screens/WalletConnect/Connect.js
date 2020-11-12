/* @flow */
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import LText from "../../components/LText";
import Button from "../../components/Button";
import { context, STATUS } from "./Provider";
import colors from "../../colors";

export default function Connect({ route }) {
  const { t } = useTranslation();
  const wcContext = useContext(context);

  useFocusEffect(() => {
    console.log("focus", wcContext);
    if (wcContext.currentCallRequestId) {
      console.log("abort error");
      wcContext.setCurrentCallRequestError(new Error("Aborted"));
    }
  }, [wcContext]);

  return (
    <>
      <View style={styles.container}>
        <LText secondary semiBold style={styles.textStyle}>
          {wcContext.status}, { route.params.defaultAccount.id }, { route.params.uri }
        </LText>
      </View>
      {wcContext.status === STATUS.DISCONNECTED ? (
        <View style={styles.buttonsContainer}>
          <Button
            containerStyle={styles.buttonContainer}
            type="secondary"
            title="Reject"
            onPress={() => {}}
          />
          <Button
            containerStyle={styles.buttonContainer}
            type="primary"
            title="Connect"
            onPress={() => {
              wcContext.connect({
                account: route.params.defaultAccount,
                uri: route.params.uri,
              });
            }}
          />
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  buttonContainer: {
    flex: 1,
    margin: 8,
  },
  textStyle: {
    color: "black",
  },
});
