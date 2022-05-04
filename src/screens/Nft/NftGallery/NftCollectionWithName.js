// @flow

import React, { useCallback, memo } from "react";
import type { ProtoNFT } from "@ledgerhq/live-common/lib/nft";
import { FlatList, View, SafeAreaView, StyleSheet } from "react-native";
import { useNftMetadata } from "@ledgerhq/live-common/lib/nft";
import NftCard from "../../../components/Nft/NftCard";
import Skeleton from "../../../components/Skeleton";
import LText from "../../../components/LText";

const NftCollectionWithNameList = ({
  collection,
  contentContainerStyle,
  status,
  metadata,
}: {
  collection: ProtoNFT[],
  contentContainerStyle?: Object,
  status: "queued" | "loading" | "loaded" | "error" | "nodata",
  metadata?: Object,
}) => {
  const nft = collection[0];
  const renderItem = useCallback(
    ({ item, index }) => (
      <NftCard
        key={item.id}
        nft={item}
        collection={collection}
        style={index % 2 === 0 ? evenNftCardStyles : oddNftCardStyles}
      />
    ),
    [collection],
  );

  return (
    <SafeAreaView style={contentContainerStyle}>
      <View style={styles.title}>
        <Skeleton
          style={styles.tokenNameSkeleton}
          loading={status === "loading"}
        >
          <LText
            numberOfOfLines={2}
            ellipsizeMode="tail"
            semiBold
            style={styles.tokenName}
          >
            {metadata?.tokenName || nft.contract}
          </LText>
        </Skeleton>
      </View>
      <FlatList
        data={collection}
        keyExtractor={nftKeyExtractor}
        scrollEnabled={false}
        numColumns={2}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

const NftCollectionWithNameMemo = memo(NftCollectionWithNameList);
// this technique of splitting the usage of context and memoing the presentational component is used to prevent
// the rerender of all Nft Collections whenever the NFT cache changes (whenever a new NFT is loaded)
type Props = {
  collection: ProtoNFT,
  contentContainerStyle?: Object,
};

const NftCollectionWithName = ({
  collection,
  contentContainerStyle,
}: Props) => {
  const nft = collection[0];
  const { status, metadata } = useNftMetadata(
    nft.contract,
    nft.tokenId,
    nft.currencyId,
  );

  return (
    <NftCollectionWithNameMemo
      collection={collection}
      contentContainerStyle={contentContainerStyle}
      status={status}
      metadata={metadata}
    />
  );
};

const nftKeyExtractor = (nft: ProtoNFT) => nft.id;

const styles = StyleSheet.create({
  title: {
    paddingBottom: 16,
  },
  tokenNameSkeleton: {
    height: 12,
    width: 250,
    borderRadius: 4,
  },
  tokenName: {
    fontSize: 22,
  },
  nftCard: {
    flex: 1,
    maxWidth: "50%",
  },
});

const evenNftCardStyles = [
  styles.nftCard,
  {
    paddingLeft: 0,
    paddingRight: 8,
  },
];

const oddNftCardStyles = [
  styles.nftCard,
  {
    paddingLeft: 8,
    paddingRight: 0,
  },
];

export default memo<Props>(NftCollectionWithName);
