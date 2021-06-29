// @flow

import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";

import TextInputMask from "react-native-text-input-mask";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation, Trans } from "react-i18next";
import { useNavigation, useTheme } from "@react-navigation/native";
import SafeAreaView from "react-native-safe-area-view";
import { submitKYC, countries } from "@ledgerhq/live-common/lib/exchange/swap";
import type { KYCData } from "@ledgerhq/live-common/lib/exchange/swap/types";
import { ScreenName } from "../../../const";

import IconWyre from "../../../icons/swap/Wyre";
import LText from "../../../components/LText";
import Button from "../../../components/Button";
import Pending from "./Pending";

import { swapKYCSelector } from "../../../reducers/settings";
import { setSwapKYCStatus } from "../../../actions/settings";

const KYC = () => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});
  const [isLoading, setLoading] = useState(false);
  const { navigate } = useNavigation();
  const swapKYC = useSelector(swapKYCSelector);
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const countryOptions = Object.entries(countries).map(([value, label]) => ({
    value,
    label,
  }));

  // TODO Might need a better setup if this form gets more complicated
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [street1, setStreet1] = useState("");
  const [street2, setStreet2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState({});
  const [country, setCountry] = useState(countryOptions[0]);
  const [postalCode, setPostalCode] = useState("");

  const kycData: KYCData = useMemo(
    () => ({
      firstName,
      lastName,
      residenceAddress: {
        street1,
        street2,
        city,
        state: state?.value,
        country: country?.value,
        postalCode,
        dateOfBirth,
      },
    }),
    [
      city,
      country?.value,
      dateOfBirth,
      firstName,
      lastName,
      postalCode,
      state,
      street1,
      street2,
    ],
  );

  const onSelectState = useCallback(() => {
    navigate(ScreenName.SwapKYCStates, { onStateSelect: setState });
  }, [navigate]);

  const onSubmitKYCData = useCallback(() => {
    let cancelled = false;
    async function onSubmitKYC() {
      setLoading(true);
      const res = await submitKYC("wyre", kycData);
      if (cancelled) return;
      dispatch(
        setSwapKYCStatus({ provider: "wyre", id: res?.id, status: res.status }),
      );
      setLoading(false);
    }
    onSubmitKYC();
    return () => {
      cancelled = true;
    };
  }, [dispatch, kycData]);

  const hasErrors = Object.keys(errors).length;
  const isValidDate = useMemo(
    () => !dateOfBirth || /[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(dateOfBirth),
    [dateOfBirth],
  );

  const canSubmit =
    !hasErrors &&
    firstName &&
    lastName &&
    street1 &&
    state?.value &&
    dateOfBirth &&
    isValidDate &&
    country &&
    postalCode;

  const color = colors.text;
  const borderColor = colors.fog;
  const dateBorderColor = isValidDate ? colors.fog : colors.alert;

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={{ flex: 1 }}>
        {swapKYC.wyre ? (
          <Pending
            status={swapKYC.wyre.status}
            onContinue={() => navigate(ScreenName.Swap)}
          />
        ) : (
          <>
            <ScrollView style={styles.scroll}>
              <View style={styles.wrapper}>
                <View style={styles.titleWrapper}>
                  <IconWyre size={18} />
                  <LText style={styles.title} color={"darkBlue"}>
                    <Trans i18nKey={"transfer.swap.kyc.wyre.title"} />
                  </LText>
                </View>
                <LText style={styles.subtitle} color={"smoke"}>
                  <Trans i18nKey={"transfer.swap.kyc.wyre.subtitle"} />
                </LText>
                <LText style={styles.label} color={"smoke"}>
                  <Trans i18nKey={"transfer.swap.kyc.wyre.form.firstName"} />
                </LText>
                <TextInput
                  style={[styles.input, { color, borderColor }]}
                  onChangeText={setFirstName}
                  editable={!isLoading}
                  clearButtonMode="while-editing"
                  placeholder={t(
                    "transfer.swap.kyc.wyre.form.firstNamePlaceholder",
                  )}
                  maxLength={30}
                />
                <LText style={styles.label} color={"smoke"}>
                  <Trans i18nKey={"transfer.swap.kyc.wyre.form.lastName"} />
                </LText>
                <TextInput
                  style={[styles.input, { color, borderColor }]}
                  onChangeText={setLastName}
                  clearButtonMode="while-editing"
                  placeholder={t(
                    "transfer.swap.kyc.wyre.form.lastNamePlaceholder",
                  )}
                  maxLength={30}
                />
                <LText style={styles.label} color={"smoke"}>
                  <Trans i18nKey={"transfer.swap.kyc.wyre.form.dateOfBirth"} />
                </LText>
                <TextInputMask
                  placeholder={t(
                    "transfer.swap.kyc.wyre.form.dateOfBirthPlaceholder",
                  )}
                  style={[
                    styles.input,
                    { color, borderColor: dateBorderColor },
                  ]}
                  onChangeText={f => setDateOfBirth(f)}
                  mask={"[0000]-[00]-[00]"}
                />
                <LText style={styles.label} color={"smoke"}>
                  <Trans i18nKey={"transfer.swap.kyc.wyre.form.address1"} />
                </LText>
                <TextInput
                  style={[styles.input, { color, borderColor }]}
                  editable={!isLoading}
                  onChangeText={setStreet1}
                  clearButtonMode="while-editing"
                  placeholder={t(
                    "transfer.swap.kyc.wyre.form.address1Placeholder",
                  )}
                  maxLength={50}
                />
                <LText style={styles.label} color={"smoke"}>
                  <Trans i18nKey={"transfer.swap.kyc.wyre.form.address2"} />
                </LText>
                <TextInput
                  style={[styles.input, { color, borderColor }]}
                  editable={!isLoading}
                  onChangeText={setStreet2}
                  clearButtonMode="while-editing"
                  placeholder={t(
                    "transfer.swap.kyc.wyre.form.address2Placeholder",
                  )}
                  maxLength={50}
                />
                <LText style={styles.label} color={"smoke"}>
                  <Trans i18nKey={"transfer.swap.kyc.wyre.form.city"} />
                </LText>
                <TextInput
                  style={[styles.input, { color, borderColor }]}
                  editable={!isLoading}
                  onChangeText={setCity}
                  clearButtonMode="while-editing"
                  placeholder={t("transfer.swap.kyc.wyre.form.cityPlaceholder")}
                  maxLength={30}
                />
                <LText style={styles.label} color={"smoke"}>
                  <Trans i18nKey={"transfer.swap.kyc.wyre.form.state"} />
                </LText>
                <TouchableOpacity onPress={onSelectState}>
                  <LText
                    style={[
                      styles.input,
                      { color: state ? color : borderColor, borderColor },
                    ]}
                  >
                    {state?.value ||
                      t("transfer.swap.kyc.wyre.form.statePlaceholder")}
                  </LText>
                </TouchableOpacity>
                <LText style={styles.label} color={"smoke"}>
                  <Trans i18nKey={"transfer.swap.kyc.wyre.form.country"} />
                </LText>
                <LText style={[styles.input, { color, borderColor }]}>
                  {country?.label}
                </LText>
                <LText style={styles.label} color={"smoke"}>
                  <Trans i18nKey={"transfer.swap.kyc.wyre.form.zipcode"} />
                </LText>
                <TextInput
                  style={[styles.input, { color, borderColor }]}
                  editable={!isLoading}
                  onChangeText={setPostalCode}
                  clearButtonMode="while-editing"
                  placeholder={t(
                    "transfer.swap.kyc.wyre.form.zipcodePlaceholder",
                  )}
                  maxLength={30}
                />
              </View>
            </ScrollView>
            <View style={styles.footer}>
              <Button
                type={"primary"}
                pending={isLoading}
                disabled={!canSubmit || isLoading}
                onPress={onSubmitKYCData}
                title={<Trans i18nKey={"transfer.swap.providers.cta"} />}
              />
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  wrapper: {
    padding: 16,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    lineHeight: 21,
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 12,
  },
  scroll: {},
  footer: {
    padding: 16,
  },
  disclaimer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    lineHeight: 19,
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    minHeight: 52,
    borderRadius: 4,
    padding: 16,
    fontSize: 14,
    flex: 1,
  },
});

export default KYC;
