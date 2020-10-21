// $flow
import React, { useCallback } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Trans } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import BaseInfoModal from "../BaseModal";
import termsImg from "../../../../images/lending-terms.png";
import { ScreenName } from "../../../../const";

export default function LendingInfoStep1() {
  const navigation = useNavigation();
  const onNext = useCallback(() => {
    navigation.push(ScreenName.LendingInfo2);
  }, [navigation]);

  return (
    <BaseInfoModal
      title={<Trans i18nKey="transfer.lending.info.1.title" />}
      description={<Trans i18nKey="transfer.lending.info.1.description" />}
      badgeLabel={<Trans i18nKey="transfer.lending.info.1.label" />}
      illustration={
        <View style={styles.imageContainer}>
          <Image style={styles.image} resizeMode="contain" source={termsImg} />
        </View>
      }
      onNext={onNext}
    />
  );
}

const styles = StyleSheet.create({
  imageContainer: { width: "100%", height: "100%", paddingHorizontal: 24 },
  image: { width: "100%", height: "100%" },
});
