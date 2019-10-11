// @flow
import React, { PureComponent } from "react";
import { View, StyleSheet } from "react-native";
import { Trans } from "react-i18next";
import { BigNumber } from "bignumber.js";
import type {
  Unit,
  Account,
  AccountLike,
} from "@ledgerhq/live-common/lib/types";
import {
  getMainAccount,
  getAccountUnit,
} from "@ledgerhq/live-common/lib/account";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { getDeviceModel } from "@ledgerhq/devices";

import colors from "../../colors";

import LText from "../../components/LText";
import DeviceNanoAction from "../../components/DeviceNanoAction";
import VerifyAddressDisclaimer from "../../components/VerifyAddressDisclaimer";
import CurrencyUnitValue from "../../components/CurrencyUnitValue";
import getWindowDimensions from "../../logic/getWindowDimensions";

type Props = {
  action: () => void,
  modelId: *,
  transaction: *,
  account: AccountLike,
  parentAccount: ?Account,
  wired: boolean,
};

type State = {
  total: ?BigNumber,
  maxAmount: ?BigNumber,
};

const { width } = getWindowDimensions();

class DataRow extends PureComponent<{
  label: *,
  value: BigNumber,
  unit: Unit,
}> {
  render() {
    const { label, value, unit } = this.props;
    return (
      <View style={styles.dataRow}>
        <LText numberOfLines={1} style={styles.dataRowLabel}>
          {label}
        </LText>
        <LText tertiary style={styles.dataRowValue}>
          <CurrencyUnitValue unit={unit} value={value} disableRounding />
        </LText>
      </View>
    );
  }
}

class ValidateOnDevice extends PureComponent<Props, State> {
  state = {
    total: null,
    maxAmount: null,
  };

  componentDidMount() {
    this.syncTotal();
    this.syncMaxAmount();
  }

  componentDidUpdate({ account, transaction }: Props) {
    if (
      account !== this.props.account ||
      transaction !== this.props.transaction
    ) {
      this.syncTotal();
      this.syncMaxAmount();
    }
  }

  componentWillUnmount() {
    this.syncTotalId++;
    this.syncMaxAmountId++;
  }

  syncTotalId = 0;
  syncTotal = async () => {
    const id = ++this.syncTotalId;
    const { transaction, account, parentAccount } = this.props;
    const bridge = getAccountBridge(account, parentAccount);
    const mainAccount = getMainAccount(account, parentAccount);
    const total = await bridge.getTotalSpent(mainAccount, transaction);
    if (id === this.syncTotalId) {
      this.setState({ total });
    }
  };

  syncMaxAmountId = 0;
  syncMaxAmount = async () => {
    const id = ++this.syncMaxAmountId;
    const { account, parentAccount, transaction } = this.props;
    if (!account) return;
    const bridge = getAccountBridge(account, parentAccount);
    const mainAccount = getMainAccount(account, parentAccount);

    const useAllAmount = bridge.getTransactionExtra(
      mainAccount,
      transaction,
      "useAllAmount",
    );

    let maxAmount;
    if (useAllAmount)
      maxAmount = await bridge.getMaxAmount(mainAccount, transaction);

    if (id === this.syncMaxAmountId) {
      this.setState(old => {
        if (
          !maxAmount ||
          (old.maxAmount && maxAmount && maxAmount.eq(old.maxAmount))
        ) {
          return null;
        }
        return { maxAmount };
      });
    }
  };

  render() {
    const { transaction, account, parentAccount, modelId, wired } = this.props;
    const { total, maxAmount } = this.state;
    const bridge = getAccountBridge(account, parentAccount);
    const mainAccount = getMainAccount(account, parentAccount);
    const unit = getAccountUnit(account);
    const amount = bridge.getTransactionAmount(mainAccount, transaction);

    const useAllAmount = bridge.getTransactionExtra(
      mainAccount,
      transaction,
      "useAllAmount",
    );

    // FIXME this is not the correct way. we will introduce new concept in the bridge.
    const fees = total
      ? maxAmount && useAllAmount
        ? total.minus(maxAmount)
        : total.minus(amount)
      : BigNumber(0);

    return (
      <View style={styles.root}>
        <View style={styles.innerContainer}>
          <View style={styles.picture}>
            <DeviceNanoAction
              modelId={modelId}
              wired={wired}
              action="accept"
              width={width * 0.8}
              screen="validation"
            />
          </View>
          <View style={styles.titleContainer}>
            <LText secondary semiBold style={styles.title}>
              <Trans
                i18nKey="send.validation.title"
                values={getDeviceModel(modelId)}
              />
            </LText>
          </View>

          <View style={styles.dataRows}>
            <DataRow
              label={<Trans i18nKey="send.validation.amount" />}
              unit={unit}
              value={useAllAmount && maxAmount ? maxAmount : amount}
            />
            {!fees.isZero() ? (
              <DataRow
                label={<Trans i18nKey="send.validation.fees" />}
                unit={mainAccount.unit}
                value={fees}
              />
            ) : null}
          </View>
        </View>

        <VerifyAddressDisclaimer
          text={<Trans i18nKey="send.validation.disclaimer" />}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 16,
  },
  dataRows: {
    marginVertical: 24,
    alignSelf: "stretch",
  },
  dataRow: {
    padding: 12,
    borderRadius: 4,
    backgroundColor: colors.lightGrey,
    alignItems: "center",
    flexDirection: "row",
  },
  dataRowLabel: {
    color: colors.grey,
    textAlign: "left",
    fontSize: 14,
    paddingRight: 16,
  },
  dataRowValue: {
    color: colors.darkBlue,
    fontSize: 14,
    flex: 1,
    textAlign: "right",
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  picture: {
    marginBottom: 40,
  },
  titleContainer: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
    color: colors.darkBlue,
    textAlign: "center",
  },
});

export default ValidateOnDevice;
