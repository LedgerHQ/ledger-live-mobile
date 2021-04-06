/* @flow */
import React, { useContext } from "react";
import Touchable from "../components/Touchable";
import TabIcon from "../components/TabIcon";
import CreateModal from "../modals/Create";
import TransferIcon from "../icons/Transfer";
import { lockSubject } from "../components/RootNavigator/CustomBlockRouterNavigator";
import { context, enableHole } from "./ProductTour/Provider";

const hitSlop = {
  top: 10,
  left: 25,
  right: 25,
  bottom: 25,
};

type Props = {
  tintColor: string,
  navigation: any,
  isOpen: boolean,
  setIsOpen: (isopen: boolean) => void,
  ...
};

export default () => null;

export function TransferTabIcon({
  tintColor,
  navigation,
  isOpen,
  setIsOpen,
  ...rest
}: Props) {
  const ptContext = useContext(context);
  function openModal() {
    if (ptContext.holeConfig) {
      enableHole(`-${ptContext.holeConfig}`);
    }
    setIsOpen(true);
  }

  function onModalClose() {
    setIsOpen(false);
  }

  return (
    <>
      <Touchable
        event="Transfer"
        disabled={lockSubject.getValue()}
        hitSlop={hitSlop}
        onPress={openModal}
      >
        {/* $FlowFixMe */}
        <TabIcon
          Icon={TransferIcon}
          i18nKey="tabs.transfer"
          tintColor={tintColor}
          navigation={navigation}
          {...rest}
        />
      </Touchable>
      <CreateModal
        disableDoubleCheck={true}
        isOpened={isOpen}
        onClose={onModalClose}
      />
    </>
  );
}
