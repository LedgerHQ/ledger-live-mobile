// @flow
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import type { SolanaStakeWithMeta } from "@ledgerhq/live-common/lib/families/solana/types";
import type { Currency, Unit } from "@ledgerhq/live-common/lib/types";
import { useTheme } from "@react-navigation/native";
import CounterValue from "../../../components/CounterValue";
import ArrowRight from "../../../icons/ArrowRight";
import LText from "../../../components/LText";
import FirstLetterIcon from "../../../components/FirstLetterIcon";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import { BigNumber } from "bignumber.js";
import ValidatorImage from "../shared/ValidatorImage";

type Props = {
  stakeWithMeta: SolanaStakeWithMeta,
  currency: Currency,
  unit: Unit,
  onPress: (stakeWithMeta: SolanaStakeWithMeta) => void,
  isLast?: boolean,
};

export default function DelegationRow({
  stakeWithMeta,
  currency,
  unit,
  onPress,
  isLast = false,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { stake, meta } = stakeWithMeta;

  return (
    <TouchableOpacity
      style={[
        styles.row,
        styles.wrapper,
        { backgroundColor: colors.card },
        !isLast
          ? { ...styles.borderBottom, borderBottomColor: colors.lightGrey }
          : undefined,
      ]}
      onPress={() => onPress(stakeWithMeta)}
    >
      <View style={[styles.icon]}>
        <ValidatorImage size={32} imgUrl={meta.validator?.img} />
        {/*
          // view extra style = { backgroundColor: colors.lightLive }

        <FirstLetterIcon
          label={meta.validator?.name ?? stake.delegation?.voteAccAddr ?? "-"}
        />
    */}
      </View>

      <View style={styles.nameWrapper}>
        <LText semiBold numberOfLines={1}>
          {meta.validator?.name ?? stake.delegation?.voteAccAddr ?? "-"}
        </LText>
        <View>
          <LText>{stake.activation.state}</LText>
        </View>

        <View style={styles.row}>
          <LText style={styles.seeMore} color="live">
            {t("common.seeMore")}
          </LText>
          <ArrowRight color={colors.live} size={14} />
        </View>
      </View>

      <View style={styles.rightWrapper}>
        <LText semiBold>
          {formatCurrencyUnit(
            unit,
            new BigNumber(stake.delegation?.stake || 0),
            {
              showCode: true,
              disableRounding: true,
            },
          )}
        </LText>

        <LText color="grey">
          <CounterValue
            currency={currency}
            showCode
            value={stake.delegation?.stake ?? 0}
            alwaysShowSign={false}
            withPlaceholder
          />
        </LText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeMore: {
    fontSize: 14,
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: 5,

    marginRight: 12,
  },
  nameWrapper: {
    flex: 1,
    marginRight: 8,
  },
  rightWrapper: {
    alignItems: "flex-end",
  },
});
