import React, { useEffect, useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { BottomDrawer } from "@ledgerhq/native-ui";
import ButtonUseTouchable from "../context/ButtonUseTouchable";

let isModalOpenedref: boolean | undefined = false;

export type Props = {
  id?: string;
  isOpened?: boolean;
  onClose?: () => void;
  onModalHide?: () => void;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  preventBackdropClick?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

const BottomModal = ({
  isOpened,
  onClose = () => {},
  children,
  style,
  preventBackdropClick,
  onModalHide,
  containerStyle,
  ...rest
}: Props) => {
  const [open, setIsOpen] = useState(false);

  // workarround to make sure no double modal can be opened at same time
  useEffect(
    () => () => {
      isModalOpenedref = false;
    },
    [],
  );

  useEffect(() => {
    if (!!isModalOpenedref && isOpened) {
      onClose();
    } else {
      setIsOpen(isOpened ?? false);
    }
    isModalOpenedref = isOpened;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpened]); // do not add onClose it might cause some issues on modals ie: filter manager modal

  return (
    <ButtonUseTouchable.Provider value={true}>
      <BottomDrawer
        preventBackdropClick={preventBackdropClick}
        isOpen={open}
        onClose={() => {
          onClose && onClose();
          onModalHide && onModalHide();
        }}
        modalStyle={style}
        containerStyle={containerStyle}
        {...rest}
      >
        {children}
      </BottomDrawer>
    </ButtonUseTouchable.Provider>
  );
};

export default BottomModal;
