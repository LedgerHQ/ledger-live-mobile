import React, { useCallback, useMemo } from "react";
import { StyleSheet, FlatList } from "react-native";
import { Box, Flex, Text, Icons } from "@ledgerhq/native-ui";
import { useDispatch, useSelector } from "react-redux";
import { hiddenNftCollectionsSelector } from "../../../reducers/settings";
import { accountSelector } from "../../../reducers/accounts";
import type { NFT, NFTMetadataResponse } from "@ledgerhq/live-common/lib/types"
import { useNftMetadata } from "@ledgerhq/live-common/lib/nft/NftMetadataProvider";
import NftImage from "../../../components/Nft/NftImage";
import Skeleton from "../../../components/Skeleton";
import { TouchableOpacity } from "react-native-gesture-handler";
import { unhideNftCollection } from "../../../actions/settings";

// TODO this type is wrongly declared on live-common, fix it there then remove it here
type MetaDataType = NFTMetadataResponse["result"];

const HiddenNftCollectionRow = ({
  contractAddress,
  accountId,
  onUnhide,
}: {
  contractAddress: string;
  accountId: string;
  onUnhide: () => void;
}) => {
  const account = useSelector(state => accountSelector(state, { accountId }));

  const firstNft = account?.nfts.find((nft: NFT) => nft.collection.contract === contractAddress);

  const nftMetadata = useNftMetadata(contractAddress, firstNft?.tokenId);
  const { status } = nftMetadata;
  const metadata = status === "loaded" ? nftMetadata.metadata as MetaDataType : undefined;
  const tokenName = metadata?.tokenName;

  const loading = useMemo(() => status === "loading", [status]);

  return (
    <Flex p={6} flexDirection="row" alignItems="center">
      <NftImage
        style={styles.collectionImage}
        status={status}
        src={metadata?.media}
      />
      <Flex ml={6} flexDirection="row" alignItems="center" justifyContent="space-between" flexGrow={1}>
        <Skeleton style={styles.collectionNameSkeleton} loading={loading}>
          <Text
            fontWeight={"semiBold"}
            variant={"large"}
            ellipsizeMode="tail"
            numberOfLines={2}
          >
            {tokenName || contractAddress}
          </Text>
        </Skeleton>
        <TouchableOpacity onPress={onUnhide}>
          <Icons.CloseMedium color="neutral.c100" size={24}  />
        </TouchableOpacity>
      </Flex>      
    </Flex>
  )
};

const HiddenNftCollections = () => {
  const hiddenCollections = useSelector(hiddenNftCollectionsSelector);
  const dispatch = useDispatch();

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      const [accountId, contractAddress] = item.split('|');
      return (
        <HiddenNftCollectionRow accountId={accountId} contractAddress={contractAddress} onUnhide={() => dispatch(unhideNftCollection(item))} />
      )},
    [],
  );

  const keyExtractor = useCallback(item => item, []);

  return (
    <Box backgroundColor={"background.main"} height={"100%"}>
      <FlatList
        data={hiddenCollections}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.containerStyle}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  containerStyle: { paddingTop: 16, paddingBottom: 64, paddingHorizontal: 16 },
  collectionNameSkeleton: {
    height: 8,
    width: 113,
    borderRadius: 4,
    marginLeft: 10
  },
  collectionImage: {
    borderRadius: 4,
    width: 36,
    aspectRatio: 1,
    overflow: "hidden",
  },
});

export default HiddenNftCollections;
