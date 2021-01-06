// @flow

import React, { useCallback, useState, useEffect } from "react";
import { Trans } from "react-i18next";
import * as Keychain from "react-native-keychain";
import { useDispatch } from "react-redux";
import { StyleSheet, View, Platform } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { ScreenName } from "../../const";
import colors from "../../colors";
import { TrackScreen } from "../../analytics";
import LText from "../../components/LText";
import Button from "../../components/Button";
import PasswordInput from "../../components/PasswordInput";
import IconArrowRight from "../../icons/ArrowRight";
import { setPrivacy } from "../../actions/settings";

type Props = {
  navigation: any,
  route: { params: RouteParams },
};

type RouteParams = {};

export default function AddAccountsSuccess({ navigation }: Props) {
  const [secure1, setSecure1] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [biometricsType, setBiometricsType] = useState("");
  const dispatch = useDispatch();

  const primaryCTA = useCallback(async () => {
    const options =
      Platform.OS === "ios"
        ? {}
        : {
            accessControl: Keychain.ACCESS_CONTROL.APPLICATION_PASSWORD,
            rules: Keychain.SECURITY_RULES.NONE,
          };
    try {
      await Keychain.setGenericPassword("ledger", pass1, options);
      dispatch(
        setPrivacy({
          biometricsType,
          biometricsEnabled: false,
        }),
      );
      navigation.navigate(ScreenName.CustomizeAppCountervalues);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log("could not save credentials");
    }
  }, [biometricsType, dispatch, navigation, pass1]);

  const secondaryCTA = useCallback(() => {
    navigation.navigate(ScreenName.CustomizeAppCountervalues);
  }, [navigation]);

  useEffect(() => {
    Keychain.getSupportedBiometryType().then(biometricsType => {
      if (biometricsType) setBiometricsType(biometricsType);
    });
  });

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        <TrackScreen category="CustomizeApp" name="Password" />
        <LText secondary style={styles.description}>
          <Trans i18nKey="customizeapp.password.description" />
        </LText>
        <LText secondary style={styles.inputtitle}>
          <Trans i18nKey="customizeapp.password.newPassword" />
        </LText>
        <PasswordInput
          secureTextEntry={secure1}
          toggleSecureTextEntry={() => setSecure1(!secure1)}
          onChange={setPass1}
          value={pass1}
          placeholder=""
          onSubmit={() => {}}
        />
        <LText
          secondary
          style={[
            styles.inputtitle,
            pass2 && pass1 !== pass2 ? styles.invalid : {},
          ]}
        >
          <Trans i18nKey="customizeapp.password.confirmPassword" />
        </LText>
        <PasswordInput
          secureTextEntry={secure2}
          toggleSecureTextEntry={() => setSecure2(!secure2)}
          onChange={setPass2}
          value={pass2}
          placeholder=""
          onSubmit={() => {}}
        />
      </View>
      <View>
        <Button
          event="CustomizeAppPasswordContinue"
          containerStyle={styles.button}
          type="primary"
          title={<Trans i18nKey="customizeapp.password.cta" />}
          onPress={primaryCTA}
          disabled={!pass1 || pass1 !== pass2}
        />
        <Button
          event="CustomizeAppPasswordSkip"
          onPress={secondaryCTA}
          type="lightSecondary"
          title={<Trans i18nKey="customizeapp.password.skip" />}
          IconRight={() => <IconArrowRight color={colors.live} size={20} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
  },
  inputtitle: {
    marginBottom: 8,
    marginTop: 24,
    fontSize: 13,
    color: colors.darkBlue,
  },
  invalid: {
    color: colors.alert,
  },
  description: {
    marginTop: 24,
    fontSize: 13,
    color: colors.darkBlue,
  },
  button: {
    marginBottom: 16,
  },
});
