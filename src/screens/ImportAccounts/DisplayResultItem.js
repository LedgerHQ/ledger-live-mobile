// @flow
import React, { Component } from "react";
import { Animated, View, StyleSheet, PanResponder } from "react-native";
import type { Account } from "@ledgerhq/live-common/lib/types";
import Swipeable from "react-native-gesture-handler/Swipeable";
import type { NavigationScreenProp } from "react-navigation";
import { withNavigation } from "react-navigation";
import AccountCard from "../../components/AccountCard";
import CheckBox from "../../components/CheckBox";
import { track } from "../../analytics";
import Button from "../../components/Button";
import TouchHintCircle from "../../components/TouchHintCircle";

const selectableModes = ["create", "patch"];

class DisplayResultItem extends Component<
  {
    account: Account,
    mode: *,
    checked: boolean,
    importing: boolean,
    onSwitch: (boolean, Account) => void,
    onAccountNameChange: (string, Account) => void,
    index?: number,
    navigation: NavigationScreenProp<*>,
    signalOtherRows: (?number) => void,
    openIndex?: number,
  },
  { animEnded: boolean },
> {
  state = {
    animEnded: false,
  };

  panResponder: PanResponder;
  swipeableRow: Swipeable;

  onSwitch = () => {
    track(this.props.checked ? "AccountSwitchOff" : "AccountSwitchOn");
    this.props.onSwitch(!this.props.checked, this.props.account);
  };

  renderLeftActions = (progress, dragX) => {
    const translateX = dragX.interpolate({
      inputRange: [0, 1000],
      outputRange: [-112, 888],
    });

    return (
      <Animated.View
        style={[
          styles.leftAction,
          { transform: [{ translateX }] },
          { marginLeft: 12 },
        ]}
      >
        <Button
          event="HardResetModalAction"
          type="primary"
          title="Edit Name"
          onPress={this.editAccountName}
          containerStyle={styles.buttonContainer}
        />
      </Animated.View>
    );
  };

  updateRef = ref => {
    if (ref) this.swipeableRow = ref;
  };

  editAccountName = () => {
    const { account, navigation, signalOtherRows } = this.props;
    signalOtherRows(-1);

    navigation.navigate("EditAccountName", {
      onAccountNameChange: this.onAccountNameChange.bind(this),
      account,
      accountId: -1,
    });
  };

  onAccountNameChange = name => {
    this.props.onAccountNameChange(name, this.props.account);
  };

  componentDidUpdate() {
    const { openIndex, index } = this.props;

    // If the open index doesn't match us, some other row is open
    if (openIndex !== index && this.swipeableRow) {
      this.swipeableRow.close();
    }
  }

  componentDidMount() {
    // const { index } = this.props;
    //
    // if (index === 0) {
    //   // No easy way to emulate touches without an extra library
    //   // Opens/closes 1st row with modified styles, looks ok ¯\_(ツ)_/¯
    //   setTimeout(() => this.swipeableRow.openLeft(), 200);
    //   setTimeout(() => this.swipeableRow.close(), 1000);
    //   setTimeout(() => this.setState({ animEnded: true }), 1400);
    // }
  }

  constructor(props) {
    super(props);
    this.panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponderCapture: () => false,

      onPanResponderGrant: () => {
        const { index, signalOtherRows } = this.props;
        signalOtherRows(index);
      },

      onShouldBlockNativeResponder: () => false,
    });
  }

  render() {
    const { account, checked, mode, importing, index } = this.props;
    const { animEnded } = this.state;
    const selectable = selectableModes.includes(mode);

    const showHint = selectable && !index && !animEnded;

    return (
      <View {...this.panResponder.panHandlers}>
        <Swipeable
          ref={this.updateRef}
          friction={2}
          leftThreshold={50}
          renderLeftActions={selectable ? this.renderLeftActions : undefined}
          style={{ backgroundColor: "#ffffff" }}
        >
          <View style={[styles.root, { opacity: selectable ? 1 : 0.5 }]}>
            <AccountCard account={account} style={styles.card} />
            {!selectable ? null : (
              <CheckBox
                onChange={importing ? undefined : this.onSwitch}
                isChecked={checked}
                style={styles.marginLeft}
              />
            )}
            {showHint && (
              <TouchHintCircle
                visible={showHint}
                style={styles.pulsatingCircle}
              />
            )}
          </View>
        </Swipeable>
      </View>
    );
  }
}

export default withNavigation(DisplayResultItem);

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    flex: 1,
    backgroundColor: "#ffffff",
    position: "relative",
  },
  card: {
    marginLeft: 8,
  },
  leftAction: {
    width: 100,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonContainer: {
    flex: 1,
  },
  pulsatingCircle: {
    position: "absolute",
    left: 8,
    top: 0,
    bottom: 0,
  },
  marginLeft: { marginLeft: 24 },
});
