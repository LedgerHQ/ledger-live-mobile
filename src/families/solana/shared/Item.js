// @flow
import React, { memo, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Trans } from "react-i18next";
import { BigNumber } from "bignumber.js";

import type { SolanaValidatorWithMeta } from "@ledgerhq/live-common/lib/families/solana/types";
import type { Unit } from "@ledgerhq/live-common/lib/types";

import { useTheme } from "@react-navigation/native";
import LText from "../../../components/LText";
import CurrencyUnitValue from "../../../components/CurrencyUnitValue";
import ArrowRight from "../../../icons/ArrowRight";
import FirstLetterIcon from "../../../components/FirstLetterIcon";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";

type Props = {
  validatorWithMeta: SolanaValidatorWithMeta,
  //disabled: boolean,
  //value: ?BigNumber,
  //showVal?: boolean,
  onSelect: (validatorWithMeta: SolanaValidatorWithMeta) => void,
  unit: Unit,
  //delegatedValue?: BigNumber,
};

function Item({
  //item,
  validatorWithMeta,
  //value,
  //disabled,
  onSelect,
  unit,
}: //showVal = true,
//delegatedValue,
Props) {
  const { colors } = useTheme();
  const { validator, meta } = validatorWithMeta;

  const select = () => onSelect(validatorWithMeta);

  return (
    <TouchableOpacity
      onPress={select}
      //disabled={isDisabled}
      style={[styles.wrapper]}
    >
      <View style={[styles.iconWrapper, { backgroundColor: colors.lightLive }]}>
        <FirstLetterIcon
          //style={isDisabled ? { backgroundColor: colors.lightFog } : {}}
          style={{ backgroundColor: colors.lightFog }}
          label={meta.name ?? validator.voteAccAddr}
        />
      </View>

      <View style={styles.nameWrapper}>
        <LText semiBold style={[styles.nameText]} numberOfLines={1}>
          {meta.name ?? validator.voteAccAddr}
        </LText>

        <LText style={styles.subText} color="grey" numberOfLines={1}>
          {formatCurrencyUnit(unit, new BigNumber(validator.activatedStake), {
            showCode: true,
          })}
        </LText>
      </View>
      {/*
        <View style={styles.value}>
          {(showVal || value) && (
            <View style={styles.valueContainer}>
              <LText
                semiBold
                style={[styles.valueLabel]}
                //color={isDisabled ? "grey" : "darkBlue"}
                color={"darkBlue"}
              >
                {value ? (
                  <CurrencyUnitValue
                    value={value}
                    unit={unit}
                    showCode={false}
                  />
                ) : (
                  "0"
                )}
              </LText>

              {delegatedValue && delegatedValue.gt(0) ? (
                <LText
                  style={[styles.valueLabel, styles.subText]}
                  color="grey"
                  numberOfLines={1}
                >
                  <Trans i18nKey="cosmos.delegation.flow.steps.validator.currentAmount">
                    <CurrencyUnitValue
                      value={delegatedValue}
                      unit={unit}
                      showCode={false}
                    />
                  </Trans>
                </LText>
              ) : null}
            </View>
          )}
          <ArrowRight size={16} color={colors.grey} />
        </View>
        */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconWrapper: {
    height: 36,
    width: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,

    marginRight: 12,
  },
  nameWrapper: {
    flex: 1,
    paddingRight: 16,
  },
  nameText: {
    fontSize: 15,
  },
  subText: {
    fontSize: 13,
  },
  valueContainer: { alignItems: "flex-end" },
  value: { flexDirection: "row", alignItems: "center" },
  valueLabel: { paddingHorizontal: 8, fontSize: 16 },
});

export default memo<Props>(Item);
