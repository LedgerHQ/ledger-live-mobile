import React from "react";
import ReactNativeModal from "react-native-modal";
import styled from "styled-components/native";

import sizes from "@ui/helpers/getDeviceSize";
import { ModalProps } from "@components/Layout/Modal";

const { width, height } = sizes;

const Container = styled.View`
  background-color: ${(p) => p.theme.colors.palette.background.default};
`;

const ContentContainer = styled.View`
  padding-horizontal: ${(p) => p.theme.space[3]}px;
  padding-vertical: ${(p) => p.theme.space[6]}px;
`;

const modalStyle = {
  flex: 1,
  justifyContent: "flex-end",
  margin: 0,
};

export default function Tooltip({
  isOpen,
  onClose = () => {},
  containerStyle,
  preventBackdropClick,
  style,
  children,
  ...rest
}: Partial<ModalProps>): React.ReactElement {
  const backDropProps = preventBackdropClick
    ? {}
    : {
        onBackdropPress: onClose,
        onBackButtonPress: onClose,
        onSwipeComplete: onClose,
      };

  return (
    <ReactNativeModal
      {...rest}
      {...backDropProps}
      isVisible={isOpen}
      // @ts-expect-error  issue in typing in react-native-modal
      deviceWidth={width}
      // @ts-expect-error issue in typing in react-native-modal
      deviceHeight={height}
      useNativeDriver
      hideModalContentWhileAnimating
      onModalHide={onClose}
      useNativeDriverForBackdrop
      swipeDirection={["down"]}
      propagateSwipe={true}
      style={[modalStyle, style || {}]}
    >
      <Container style={containerStyle}>
        <ContentContainer>{children}</ContentContainer>
      </Container>
    </ReactNativeModal>
  );
}
