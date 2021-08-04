import React from "react";
import ReactNativeModal from "react-native-modal";
import styled from "styled-components/native";

import sizes from "@ui/helpers/getDeviceSize";
import Button from "@ui/components/Button";
import Close from "@ui/icons/Close";

const { width, height } = sizes;

type Props = {
  isOpen?: boolean;
  onClose?: () => void;
  style?: object;
  containerStyle?: object;
  preventBackdropClick?: boolean;
  children: React.ReactNode;
};

const Container = styled.View`
  flex: 1;
  background-color: ${(p) => p.theme.colors.palette.background.default};
`;

const ContentContainer = styled.View`
  flex: 1;
  padding: ${(p) => p.theme.space[2]}px;
`;

const Header = styled.View`
  height: ${(p) => p.theme.space[6]}px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: ${(p) => p.theme.space[2]}px;
`;

const modalStyle = {
  flex: 1,
  justifyContent: "flex-end",
  margin: 0,
};

export default function Modal({
  isOpen,
  onClose = () => {},
  containerStyle,
  preventBackdropClick,
  style,
  children,
  ...rest
}: Partial<Props>): React.ReactElement {
  const backDropProps = preventBackdropClick
    ? {}
    : {
        onBackdropPress: onClose,
        onBackButtonPress: onClose,
      };

  return (
    <ReactNativeModal
      {...rest}
      {...backDropProps}
      isVisible={isOpen}
      // @ts-ignore issue in typing in react-native-modal
      deviceWidth={width}
      // @ts-ignore issue in typing in react-native-modal
      deviceHeight={height}
      useNativeDriver
      hideModalContentWhileAnimating
      onModalHide={onClose}
      style={[modalStyle, style || {}]}
    >
      <Container style={containerStyle}>
        <Header>
          <Button Icon={Close} onPress={onClose} />
        </Header>
        <ContentContainer>{children}</ContentContainer>
      </Container>
    </ReactNativeModal>
  );
}
