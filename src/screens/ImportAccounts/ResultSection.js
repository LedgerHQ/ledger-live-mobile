// @flow
import React, { memo } from "react";
import { StyleSheet } from "react-native";
import { Trans } from "react-i18next";
import { useTheme } from "@react-navigation/native";
import LText from "../../components/LText";
import colors from "../../colors";

type Props = { mode: string };

function ResultSection({ mode }: Props) {
  const { colors } = useTheme();
  let text;
  switch (mode) {
    case "create":
      text = <Trans i18nKey="account.import.result.newAccounts" />;
      break;
    case "update":
      text = <Trans i18nKey="account.import.result.updatedAccounts" />;
      break;
    case "empty":
      text = <Trans i18nKey="account.import.result.empty" />;
      break;
    case "id":
      text = <Trans i18nKey="account.import.result.alreadyImported" />;
      break;
    case "unsupported":
      text = <Trans i18nKey="account.import.result.unsupported" />;
      break;
    case "settings":
      text = <Trans i18nKey="account.import.result.settings" />;
      break;
    default:
      text = "";
  }
  return (
    <LText
      semiBold
      style={[styles.sectionHeaderText, { backgroundColor: colors.white }]}
    >
      {text}
    </LText>
  );
}

const styles = StyleSheet.create({
  sectionHeaderText: {
    color: colors.grey,
    fontSize: 14,
    paddingTop: 24,
    paddingBottom: 16,
    marginLeft: 8,
  },
});

export default memo<Props>(ResultSection);
