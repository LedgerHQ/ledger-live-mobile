import React, { useCallback, useState } from "react";

import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";

import {
  BottomDrawer,
  Text,
  Icons,
  BoxedIcon,
  Button,
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
  const { colors } = useTheme();
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
          <View style={styles.menuItem}>
            <View
              style={[
                styles.menuIconContainer,
                { backgroundColor: colors.primary.c30 },
              ]}
            >
              <Icons.EyeNoneMedium color="primary.c90" />
            </View>
            <Text variant="body" color="primary.c90" fontWeight="semiBold">
              {t("settings.accounts.hideNFTCollectionCTA")}
            </Text>
          </View>
        </TouchableOpacity>
      </BottomDrawer>
      <BottomDrawer
        isOpen={isConfirmDrawerOpen}
        onClose={() => setIsConfirmDrawerOpen(false)}
      >
        <View style={styles.confirmDrawerContainer}>
          <BoxedIcon Icon={Icons.EyeNoneMedium} size={48} />
          <Text variant="h1" style={styles.corfirmDrawerTitle}>
            {t("settings.accounts.hideNFTCollectionModal.title")}
          </Text>
          <Text variant="body" style={styles.confirmDrawerDescription}>
            {t("settings.accounts.hideNFTCollectionModal.desc")}
          </Text>
          <Button type="main" style={styles.confirmDrawerButtons} onPress={onConfirm}>
            {t("common.confirm")}
          </Button>
          <Button type="default" style={styles.confirmDrawerButtons} onPress={() => setIsConfirmDrawerOpen(false)}>
            {t("common.cancel")}
          </Button>
        </View>
      </BottomDrawer>
    </>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIconContainer: {
    marginRight: 10,
    padding: 8,
    borderRadius: 50,
  },
  confirmDrawerContainer: {
    alignItems: "center",
  },
  corfirmDrawerTitle: {
    marginTop: 20,
  },
  confirmDrawerDescription: {
    textAlign: "center",
    marginTop: 20,
  },
  confirmDrawerButtons: {
    marginTop: 20,
    width: "100%",
  },
});

export default React.memo(NftCollectionOptionsMenu);
