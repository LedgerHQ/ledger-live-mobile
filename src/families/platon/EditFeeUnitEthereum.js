// @flow
import React, { useCallback } from "react";
import { BigNumber } from "bignumber.js";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import Slider from "react-native-slider";
import { useTheme } from "@react-navigation/native";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import type { Transaction } from "@ledgerhq/live-common/lib/families/platon/types";
import {
  reverseRangeIndex,
  projectRangeIndex,
} from "@ledgerhq/live-common/lib/range";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import LText from "../../components/LText";
import CurrencyUnitValue from "../../components/CurrencyUnitValue";

const GasSlider = React.memo(({ value, onChange, range }: *) => {
  const { colors } = useTheme();
  const index = reverseRangeIndex(range, value);
  const setValueIndex = useCallback(
    i => onChange(projectRangeIndex(range, i)),
    [range, onChange],
  );

  return (
    <Slider
      value={index}
      step={1}
      onValueChange={setValueIndex}
      minimumValue={0}
      maximumValue={range.steps - 1}
      thumbTintColor={colors.live}
      minimumTrackTintColor={colors.live}
    />
  );
});

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
  transaction: Transaction,
  gasPrice: BigNumber,
  onChange: Function,
  range: any,
};

export default function EditFeeUnitEthereum({
  account,
  parentAccount,
  transaction,
  gasPrice,
  onChange,
  range,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const mainAccount = getMainAccount(account, parentAccount);

  const feeCustomUnit = transaction.feeCustomUnit;

  const onChangeF = useCallback(
    value => {
      onChange(value);
    },
    [onChange],
  );

  const { networkInfo } = transaction;
  if (!networkInfo) return null;
  const { gasPrice: serverGas } = networkInfo;

  return (
    <View>
      <View style={[styles.sliderContainer, { backgroundColor: colors.card }]}>
        <View style={styles.gasPriceHeader}>
          <LText style={styles.gasPriceLabel} semiBold>
            {t("send.summary.gasPrice")}
          </LText>
          <View
            style={[styles.gasPrice, { backgroundColor: colors.lightLive }]}
          >
            <LText style={[styles.currencyUnitText, { color: colors.live }]}>
              <CurrencyUnitValue
                unit={feeCustomUnit || mainAccount.unit}
                value={gasPrice}
              />
            </LText>
          </View>
        </View>
        <View style={styles.container}>
          <GasSlider
            defaultGas={serverGas}
            value={gasPrice}
            range={range}
            onChange={onChangeF}
          />
          <View style={styles.textContainer}>
            <LText color="grey" style={styles.currencyUnitText}>
              {t("common.slow")}
            </LText>
            <LText color="grey" style={styles.currencyUnitText}>
              {t("common.fast")}
            </LText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sliderContainer: {
    paddingLeft: 0,
  },
  gasPriceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gasPriceLabel: {
    fontSize: 20,
  },
  gasPrice: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  container: {
    flexDirection: "column",
    justifyContent: "center",
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  currencyUnitText: {
    fontSize: 14,
    textTransform: "capitalize",
  },
});
