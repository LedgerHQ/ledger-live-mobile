import React, { memo } from "react";
import { TouchableWithoutFeedback, View, StyleSheet } from "react-native";
import { useNftMetadata } from "@ledgerhq/live-common/lib/nft";
import { useRoute, useTheme, RouteProp } from "@react-navigation/native";
import { ProtoNFT } from "@ledgerhq/live-common/lib/types";
import { scrollToTop } from "../../../navigation/utils";
import NftImage from "../../../components/Nft/NftImage";
import LText from "../../../components/LText";

type RouteParams = RouteProp<{ params: { collection: ProtoNFT[] } }, "params">;

const NftCollectionHeaderTitle = () => {
  const { params } = useRoute<RouteParams>();
  const { colors } = useTheme();
  const { collection } = params;
  const nft = collection?.[0];
  const { status, metadata } = useNftMetadata(
    nft?.contract,
    nft?.tokenId,
    nft?.currencyId,
  );

  return (
    <TouchableWithoutFeedback onPress={scrollToTop}>
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor: colors.card,
          },
        ]}
      >
        <NftImage
          height={24}
          width={24}
          style={styles.headerImage}
          src={metadata?.media}
          status={status}
        />
        <LText
          ellipsizeMode={metadata?.tokenName ? "tail" : "middle"}
          semiBold
          secondary
          numberOfLines={1}
          style={styles.title}
        >
          {metadata?.tokenName || nft?.contract}
        </LText>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    paddingRight: 32,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 32,
    paddingVertical: 5,
  },
  headerImage: {
    borderRadius: 4,
    marginRight: 12,
  },
});

export default memo(NftCollectionHeaderTitle);
