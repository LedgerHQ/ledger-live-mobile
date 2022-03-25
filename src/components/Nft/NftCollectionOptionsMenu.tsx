import React, { useCallback, useState } from "react";

import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";

import {
  BottomDrawer,
  Text,
  Icons,
  BoxedIcon,
  Button,
  Flex,
} from "@ledgerhq/native-ui";
import { CollectionWithNFT } from "@ledgerhq/live-common/lib/nft";
import { Account } from "@ledgerhq/live-common/lib/types";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components/native";
import { hideNftCollection } from "../../actions/settings";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  collection: CollectionWithNFT;
  account: Account;
};

const NftCollectionOptionsMenu = ({
  isOpen,
  onClose,
  collection,
  account,
}: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [isConfirmDrawerOpen, setIsConfirmDrawerOpen] = useState(false);


  const onConfirm = useCallback(() => {
    dispatch(hideNftCollection(`${account.id}|${collection.contract}`))
    setIsConfirmDrawerOpen(false);
    onClose();
  }, [setIsConfirmDrawerOpen, onClose, dispatch]);

  return (
    <>
      <BottomDrawer isOpen={isOpen} onClose={onClose}>
        <TouchableOpacity onPress={() => setIsConfirmDrawerOpen(true)}>
          <Flex flexDirection="row" alignItems="center">
            <Flex
              backgroundColor="primary.c30"
              p={3}
              borderRadius={50}
              mr={4}
            >
              <Icons.EyeNoneMedium color="primary.c90" />
            </Flex>
            <Text variant="body" color="primary.c90" fontWeight="semiBold">
              {t("settings.accounts.hideNFTCollectionCTA")}
            </Text>
          </Flex>
        </TouchableOpacity>
      </BottomDrawer>
      <BottomDrawer
        isOpen={isConfirmDrawerOpen}
        onClose={() => setIsConfirmDrawerOpen(false)}
      >
        <Flex alignItems="center">
          <BoxedIcon Icon={Icons.EyeNoneMedium} size={48} />
          <Text variant="h1" mt={20}>
            {t("settings.accounts.hideNFTCollectionModal.title")}
          </Text>
          <Text variant="body" textAlign="center" mt={20}>
            {t("settings.accounts.hideNFTCollectionModal.desc")}
          </Text>
          <Button type="main" alignSelf="stretch" mt={20} onPress={onConfirm}>
            {t("common.confirm")}
          </Button>
          <Button type="default" alignSelf="stretch" mt={20} onPress={() => setIsConfirmDrawerOpen(false)}>
            {t("common.cancel")}
          </Button>
        </Flex>
      </BottomDrawer>
    </>
  );
};

export default React.memo(NftCollectionOptionsMenu);
