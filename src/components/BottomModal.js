// @flow

import React, { useEffect, useState, useContext, useRef } from "react";
import { View, StyleSheet, Platform } from "react-native";
import ReactNativeModal from "react-native-modal";
import type { ViewStyleProp } from "react-native/Libraries/StyleSheet/StyleSheet";
import { useTheme } from "@react-navigation/native";
import TrackScreen from "../analytics/TrackScreen";
import StyledStatusBar from "./StyledStatusBar";
import ButtonUseTouchable from "../context/ButtonUseTouchable";
import getWindowDimensions from "../logic/getWindowDimensions";
import DebugRejectSwitch from "./DebugRejectSwitch";
import {
  context as _ptContext,
  reportLayout,
} from "../screens/ProductTour/Provider";

let isModalOpenedref = false;

export type Props = {
  id?: string,
  isOpened?: boolean,
  onClose?: () => void,
  onModalHide?: () => void,
  children?: *,
  style?: ViewStyleProp,
  preventBackdropClick?: boolean,
  containerStyle?: ViewStyleProp,
  styles?: ViewStyleProp,
};

// Add some extra padding at the bottom of the modal
// and make it overflow the bottom of the screen
// so that the underlying UI doesn't show up
// when it gets the position wrong and display too high
// See Jira LL-451 and GitHub #617
const EXTRA_PADDING_SAMSUNG_FIX = 100;

const { width, height } = getWindowDimensions();

const BottomModal = ({
  isOpened,
  onClose = () => {},
  children,
  style,
  preventBackdropClick,
  id,
  containerStyle,
  styles: propStyles,
  ...rest
}: Props) => {
  const { colors } = useTheme();
  const ptContext = useContext(_ptContext);
  const [open, setIsOpen] = useState(false);
  const ref = useRef();
  const backDropProps = preventBackdropClick
    ? {}
    : {
        onBackdropPress: onClose,
        onBackButtonPress: onClose,
      };

  // workarround to make sure no double modal can be opened at same time
  useEffect(
    () => () => {
      isModalOpenedref = false;
    },
    [],
  );

  useEffect(() => {
    if (!!isModalOpenedref && isOpened && !rest.disableDoubleCheck) {
      onClose();
    } else {
      setIsOpen(isOpened);
    }
    isModalOpenedref = isOpened;
  }, [isOpened]); // do not add onClose it might cause some issues on modals ie: filter manager modal

  return (
    <ButtonUseTouchable.Provider value={true}>
      <ReactNativeModal
        {...rest}
        {...backDropProps}
        isVisible={open}
        deviceWidth={width}
        deviceHeight={height}
        useNativeDriver
        hideModalContentWhileAnimating
        style={[styles.root, propStyles || {}]}
        backdropOpacity={ptContext.holeConfig ? 0 : 0.7}
      >
        <View
          style={[
            styles.modal,
            { backgroundColor: colors.card },
            containerStyle,
          ]}
          ref={ref}
          onLayout={() => {
            reportLayout(["modal"], ref);
          }}
        >
          <View style={style}>
            {open && id ? <TrackScreen category={id} /> : null}
            <StyledStatusBar
              backgroundColor={
                Platform.OS === "android" ? "rgba(0,0,0,0.7)" : "transparent"
              }
              barStyle="light-content"
            />
            {children}
          </View>
        </View>
        <DebugRejectSwitch />
      </ReactNativeModal>
    </ButtonUseTouchable.Provider>
  );
};

const styles = StyleSheet.create({
  root: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modal: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingTop: 8,
    paddingBottom: EXTRA_PADDING_SAMSUNG_FIX + 24,
    marginBottom: EXTRA_PADDING_SAMSUNG_FIX * -1,
  },
});

export default BottomModal;
