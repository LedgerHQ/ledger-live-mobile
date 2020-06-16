import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import type { MappedSwapOperation } from "@ledgerhq/live-common/lib/swap/types";
import {
  getAccountUnit,
  getAccountCurrency,
} from "@ledgerhq/live-common/lib/account/helpers";
import Icon from "react-native-vector-icons/dist/Ionicons";
import { Trans } from "react-i18next";
import CurrencyUnitValue from "../../components/CurrencyUnitValue";
import LText from "../../components/LText";
import SectionSeparator from "../../components/SectionSeparator";
import CurrencyIcon from "../../components/CurrencyIcon";
import IconSwap from "../../icons/Swap";
import { getStatusColor } from "./History/OperationRow";
import colors, { rgba } from "../../colors";

type Props = {
  navigation: any,
  route: {
    params: {
      swapOperation: MappedSwapOperation,
    },
  },
};

const OperationDetails = ({ navigation, route }: Props) => {
  const { swapOperation } = route.params;
  const {
    swapId,
    provider,
    fromAccount,
    toAccount,
    fromAmount,
    toAmount,
    status,
    operation,
  } = swapOperation;
  const fromCurrency = getAccountCurrency(fromAccount);
  const toCurrency = getAccountCurrency(toAccount);
  const statusColor = getStatusColor(status);
  // FIXME  this will break for tokens.
  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View
          style={[styles.status, { backgroundColor: rgba(statusColor, 0.1) }]}
        >
          <IconSwap color={statusColor} size={26} />
        </View>
        <LText tertiary style={styles.fromAmount}>
          <CurrencyUnitValue
            alwaysShowSign
            showCode
            unit={getAccountUnit(fromAccount)}
            value={fromAmount}
          />
        </LText>
        <View style={styles.arrow}>
          <Icon name={"ios-arrow-round-forward"} size={30} color={colors.fog} />
        </View>
        <LText tertiary style={styles.toAmount}>
          <CurrencyUnitValue
            alwaysShowSign
            showCode
            unit={getAccountUnit(toAccount)}
            value={toAmount.times(-1)}
          />
        </LText>
        <LText style={styles.statusText}>{status}</LText>

        <View style={styles.fieldsWrapper}>
          <LText style={styles.label}>
            <Trans i18nKey={"transfer.swap.operationDetails.swapId"} />
          </LText>
          <LText style={styles.value}>{swapId}</LText>
          <LText style={styles.label}>
            <Trans i18nKey={"transfer.swap.operationDetails.provider"} />
          </LText>
          <LText style={styles.value}>{provider}</LText>
          <LText style={styles.label}>
            <Trans i18nKey={"transfer.swap.operationDetails.date"} />
          </LText>
          <LText style={styles.value}>{operation.date.toString()}</LText>

          <SectionSeparator style={{ marginBottom: 32 }} />

          <LText style={styles.label}>
            <Trans i18nKey={"transfer.swap.operationDetails.from"} />
          </LText>
          <View style={styles.account}>
            <CurrencyIcon size={16} currency={toCurrency} />
            <LText semiBold style={styles.accountName}>
              {toAccount.name}
            </LText>
          </View>
          <LText style={styles.label}>
            <Trans i18nKey={"transfer.swap.operationDetails.fromAmount"} />
          </LText>
          <LText style={styles.value}>
            <CurrencyUnitValue
              showCode
              unit={getAccountUnit(fromAccount)}
              value={fromAmount}
            />
          </LText>

          <SectionSeparator style={{ marginBottom: 32 }} />

          <LText style={styles.label}>
            <Trans i18nKey={"transfer.swap.operationDetails.to"} />
          </LText>
          <View style={styles.account}>
            <CurrencyIcon size={16} currency={fromCurrency} />
            <LText semiBold style={styles.accountName}>
              {fromAccount.name}
            </LText>
          </View>
          <LText style={styles.label}>
            <Trans i18nKey={"transfer.swap.operationDetails.toAmount"} />
          </LText>
          <LText style={styles.value}>
            <CurrencyUnitValue
              showCode
              unit={getAccountUnit(toAccount)}
              value={toAmount}
            />
          </LText>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,

    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 24,
    alignItems: "center",
  },
  status: {
    height: 54,
    width: 54,
    borderRadius: 54,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  statusText: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 24,
  },
  arrow: {
    transform: [{ rotate: "90deg" }],
    marginVertical: 8,
  },
  fromAmount: {
    fontSize: 20,
    lineHeight: 24,
    color: colors.grey,
  },
  toAmount: {
    fontSize: 20,
    lineHeight: 24,
    color: colors.green,
  },
  fieldsWrapper: {
    paddingTop: 32,
    alignSelf: "stretch",
    alignItems: "flex-start",
  },
  label: {
    marginBottom: 8,
    color: colors.grey,
    fontSize: 14,
    lineHeight: 19,
  },
  value: {
    marginBottom: 32,
    color: colors.darkBlue,
    fontSize: 14,
    lineHeight: 19,
  },
  account: {
    marginBottom: 32,
    flexDirection: "row",
  },
  accountName: {
    marginLeft: 8,
    color: colors.darkBlue,
  },
});

export default OperationDetails;
