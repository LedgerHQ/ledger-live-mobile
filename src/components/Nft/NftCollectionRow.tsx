import React from "react";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  useNftMetadata,
  CollectionWithNFT,
} from "@ledgerhq/live-common/lib/nft";
import { Flex, Text } from "@ledgerhq/native-ui";
import Skeleton from "../Skeleton";
import NftImage from "./NftImage";

type Props = {
  collection: CollectionWithNFT;
  onCollectionPress: () => void;
  onLongPress: () => void;
};

function NftCollectionRow({
  collection,
  onCollectionPress,
  onLongPress,
}: Props) {
  const { contract, nfts } = collection;
  const { status, metadata } = useNftMetadata(contract, nfts[0].tokenId);
  const loading = status === "loading";

  return (
    <TouchableOpacity onLongPress={onLongPress} onPress={onCollectionPress}>
      <Flex
        accessible
        flexDirection={"row"}
        alignItems={"center"}
        py={6}
      >
        <NftImage
          style={styles.collectionImage}
          status={status}
          src={metadata?.media}
        />
        <Flex flexGrow={1} flexShrink={1} ml={6} flexDirection={"column"}>
          <Skeleton style={styles.collectionNameSkeleton} loading={loading}>
            <Text
              fontWeight={"semiBold"}
              variant={"large"}
              ellipsizeMode="tail"
              numberOfLines={2}
            >
              {metadata?.tokenName || collection.contract}
            </Text>
          </Skeleton>
        </Flex>
        <Text
          fontWeight={"medium"}
          variant={"large"}
          color={"neutral.c70"}
          ml={5}
        >
          {collection.nfts.length}
        </Text>
      </Flex>
    </TouchableOpacity>
  );
}

export default NftCollectionRow;

const styles = StyleSheet.create({
  collectionNameSkeleton: {
    height: 8,
    width: 113,
    borderRadius: 4,
  },
  collectionImage: {
    borderRadius: 4,
    width: 36,
    aspectRatio: 1,
    overflow: "hidden",
  },
});
