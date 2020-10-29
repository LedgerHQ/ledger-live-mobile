// $flow
import React, { useCallback, useState } from "react";
import { View, StyleSheet, Image, Linking } from "react-native";
import { Trans } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import BaseInfoModal from "../BaseModal";
import colors from "../../../../colors";
import Touchable from "../../../../components/Touchable";
import CheckBox from "../../../../components/CheckBox";
import LText from "../../../../components/LText";
import termsImg from "../../../../images/lending-terms.png";
import { ScreenName } from "../../../../const";
import { acceptLendingTerms, LendingUrl } from "../../../../logic/terms";

export default function TermsStep() {
  const navigation = useNavigation();
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  const onTogleAcceptedTerms = useCallback(
    () => setHasAcceptedTerms(!hasAcceptedTerms),
    [hasAcceptedTerms, setHasAcceptedTerms],
  );

  const onTermsClick = useCallback(() => {
    Linking.openURL(LendingUrl);
  }, []);

  const onNext = useCallback(() => {
    if (hasAcceptedTerms)
      acceptLendingTerms().then(() => navigation.push(ScreenName.LendingInfo1));
  }, [hasAcceptedTerms, navigation]);

  return (
    <BaseInfoModal
      title={<Trans i18nKey="transfer.lending.terms.title" />}
      description={<Trans i18nKey="transfer.lending.terms.description" />}
      badgeLabel={<Trans i18nKey="transfer.lending.terms.label" />}
      illustration={
        <View style={styles.imageContainer}>
          <Image style={styles.image} resizeMode="contain" source={termsImg} />
        </View>
      }
      disabled={!hasAcceptedTerms}
      onNext={onNext}
    >
      <View style={styles.footer}>
        <Touchable
          event="LendingTermsAcceptSwitch"
          onPress={onTogleAcceptedTerms}
        >
          <CheckBox isChecked={hasAcceptedTerms} />
        </Touchable>

        <Touchable
          event="LendingTermsConditions"
          style={styles.switchRow}
          onPress={onTermsClick}
        >
          <LText style={styles.switchLabel}>
            <Trans i18nKey="transfer.lending.terms.switchLabel">
              <LText semiBold style={styles.conditionsText} />
            </Trans>
          </LText>
        </Touchable>
      </View>
    </BaseInfoModal>
  );
}

const styles = StyleSheet.create({
  switchRow: {
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  switchLabel: {
    marginLeft: 8,
    color: colors.darkBlue,
    fontSize: 13,
    paddingRight: 16,
  },
  conditionsText: {
    textDecorationLine: "underline",
    color: colors.live,
  },
  footer: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    paddingTop: 16,
  },
  imageContainer: { width: "100%", height: "100%", paddingHorizontal: 24 },
  image: { width: "100%", height: "100%" },
});
