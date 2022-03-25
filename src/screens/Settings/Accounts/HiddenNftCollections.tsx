import React, { useCallback, useMemo } from "react";
import { FlatList } from "react-native";
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
import styled from "styled-components";

// TODO this type is wrongly declared on live-common, fix it there then remove it here
type MetaDataType = NFTMetadataResponse["result"];

const CollectionImage = styled(NftImage)`
  borderRadius: 4px;
  width: 36px;
  aspectRatio: 1;
  overflow: hidden;
`;

const CollectionNameSkeleton = styled(Skeleton)`
  height: 8px;
  width: 113px;
  borderRadius: 4px;
  marginLeft: 10px;
`;

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
      <CollectionImage
        status={status}
        src={metadata?.media}
      />
      <Flex flexDirection="row" alignItems="center" flexShrink={1} justifyContent="space-between">
        <Flex mx={6} flexGrow={1} flexShrink={1} flexDirection="column">
          <CollectionNameSkeleton loading={loading}>
            <Text
              fontWeight={"semiBold"}
              variant={"large"}
              ellipsizeMode="tail"
              numberOfLines={2}
            >
              {tokenName || contractAddress}
            </Text>
          </CollectionNameSkeleton>
        </Flex>
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
      <Flex p={5}>
        <FlatList
          data={hiddenCollections}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      </Flex>
    </Box>
  );
};

export default HiddenNftCollections;
