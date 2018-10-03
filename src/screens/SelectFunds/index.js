/* @flow */
import React, { Component } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import { BigNumber } from "bignumber.js";
import { valueFromUnit } from "@ledgerhq/live-common/lib/helpers/currencies/valueFromUnit";
import type { NavigationScreenProp } from "react-navigation";
import type { Account } from "@ledgerhq/live-common/lib/types";
import type { BigNumber as BigNumberType } from "bignumber.js";

import { accountScreenSelector } from "../../reducers/accounts";

import colors from "../../colors";

import LText from "../../components/LText/index";
import CurrencyUnitValue from "../../components/CurrencyUnitValue";
import CounterValue from "../../components/CounterValue";
import Button from "../../components/Button";

import AmountInput from "./AmountInput";
import CounterValuesSeparator from "./CounterValuesSeparator";
import Stepper from "../../components/Stepper";
import StepHeader from "../../components/StepHeader";

type Props = {
  account: Account,
  navigation: NavigationScreenProp<{
    accountId: string,
    address: string,
  }>,
};

type State = {
  amount: string,
  amountBigNumber: BigNumberType,
};

class SelectFunds extends Component<Props, State> {
  static navigationOptions = {
    headerTitle: <StepHeader title="Amount" subtitle="step 3 of 5" />,
  };

  state = {
    amount: "",
    amountBigNumber: new BigNumber(0),
  };

  blur = () => {
    Keyboard.dismiss();
  };

  onChangeText = (amount: string) => {
    if (amount && !isNaN(amount)) {
      const { account } = this.props;
      const num = new BigNumber(parseFloat(amount));
      const big = valueFromUnit(num, account.unit);
      this.setState({
        amount,
        amountBigNumber: big,
      });
    }
  };

  navigate = () => {
    const {
      account,
      navigation: {
        state: {
          // $FlowFixMe
          params: { address },
        },
      },
    } = this.props;
    const { amount, amountBigNumber } = this.state;
    this.props.navigation.navigate("SendSummary", {
      accountId: account.id,
      address,
      amount,
      // FIXME we shouldn't pass amountBigNumber because not serializable, also want to avoid derivated data
      amountBigNumber,
    });
  };

  render() {
    const { account } = this.props;
    const { amount, amountBigNumber } = this.state;

    const isWithinBalance = amountBigNumber.lt(account.balance);
    const isValid = amountBigNumber.gt(0) && isWithinBalance;

    const keyboardVerticalOffset = Platform.OS === "ios" ? 60 : 0;

    return (
      <SafeAreaView style={styles.root}>
        <Stepper nbSteps={5} currentStep={3} />
        <KeyboardAvoidingView
          style={styles.container}
          keyboardVerticalOffset={keyboardVerticalOffset}
          behavior="padding"
          enabled
        >
          <TouchableWithoutFeedback onPress={this.blur}>
            <View style={{ flex: 1 }}>
              <AmountInput
                onChangeText={this.onChangeText}
                currency={account.unit.code}
                value={amount}
                isWithinBalance={isWithinBalance}
              />
              <CounterValuesSeparator />
              <View style={styles.countervaluesWrapper}>
                <LText tertiary style={styles.countervaluesText}>
                  <CounterValue
                    showCode
                    currency={account.currency}
                    value={amountBigNumber}
                  />
                </LText>
              </View>
              <View style={styles.bottomWrapper}>
                <Button
                  type="tertiary"
                  title="USE MAX"
                  onPress={() => {
                    console.log("max"); // eslint-disable-line no-console
                  }}
                />
                <LText style={styles.available}>
                  Available : &nbsp;
                  <CurrencyUnitValue
                    showCode
                    unit={account.unit}
                    value={account.balance}
                  />
                </LText>
                <View style={styles.continueWrapper}>
                  <Button
                    type="primary"
                    title="Continue"
                    onPress={this.navigate}
                    disabled={!isValid}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: "stretch",
  },
  available: {
    fontSize: 12,
    color: colors.grey,
    marginTop: 10,
  },
  useMaxText: {
    fontSize: 10,
    color: colors.live,
  },
  countervaluesWrapper: {
    paddingTop: 24,
    paddingBottom: 32,
  },
  countervaluesText: {
    color: colors.grey,
    fontSize: 20,
  },
  bottomWrapper: {
    flex: 1,
    flexGrow: 1,
    flexDirection: "column",
    alignSelf: "stretch",
    alignItems: "center",
  },
  continueWrapper: {
    flex: 1,
    alignSelf: "stretch",
    alignItems: "stretch",
    justifyContent: "flex-end",
    paddingBottom: 16,
  },
});

const mapStateToProps = (state, props: Props): { account: Account } => ({
  account: accountScreenSelector(state, props),
});

export default connect(mapStateToProps)(SelectFunds);
