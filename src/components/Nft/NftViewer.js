// @flow

import React, { useMemo } from "react";

import {
  ScrollView,
  View,
  StyleSheet,
  Platform,
<<<<<<< Updated upstream
  Dimensions,
=======
  TouchableOpacity,
>>>>>>> Stashed changes
} from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@react-navigation/native";
import { useNftMetadata } from "@ledgerhq/live-common/lib/nft";

import type { NFT, CollectionWithNFT } from "@ledgerhq/live-common/lib/nft";

import SendIcon from "../../icons/Send";
import { rgba } from "../../colors";
import Skeleton from "../Skeleton";
import NftImage from "./NftImage";
import Button from "../Button";
import LText from "../LText";

type Props = {
  route: {
    params: RouteParams,
  },
};

type RouteParams = {
  nft: NFT,
  collection: CollectionWithNFT,
};

const Section = ({
  title,
  value,
  style,
  children,
}: {
  title: string,
  value?: any,
  style?: Object,
  children?: React$Node,
}) => (
  <View style={style}>
    <LText style={styles.sectionTitle}>{title}</LText>
    {value ? <LText semiBold>{value}</LText> : children}
  </View>
);

const NftViewer = ({ route: { params } }: Props) => {
  const { nft, collection } = params;
  const { colors } = useTheme();
  const { status, metadata } = useNftMetadata(collection.contract, nft.tokenId);
  const { t } = useTranslation();
  const isLoading = status === "loading";

  const properties = useMemo(() => {
    if (isLoading) {
      return (
        <View style={[styles.main, { flexDirection: "row" }]}>
          <Skeleton
            style={[styles.property, styles.propertySekeletonOne]}
            loading={true}
          />
          <Skeleton
            style={[styles.property, styles.propertySekeletonTwo]}
            loading={true}
          />
          <Skeleton
            style={[styles.property, styles.propertySekeletonThree]}
            loading={true}
          />
        </View>
      );
    }

    if (metadata?.properties?.length) {
      return (
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          contentContainerStyle={styles.properties}
        >
          {metadata?.properties?.map?.((prop, i) => (
            <View
              style={[
                styles.property,
                {
                  backgroundColor: rgba(colors.live, 0.1),
                },
              ]}
              key={i}
            >
              <LText style={{ color: rgba(colors.live, 0.5) }}>
                {prop.key}
              </LText>
              <LText style={{ color: colors.live }}>{prop.value}</LText>
            </View>
          ))}
        </ScrollView>
      );
    }

    return (
      <View style={[styles.main]}>
        <LText semiBold>-</LText>
      </View>
    );
  }, [colors, isLoading, metadata]);

  const description = useMemo(
    () =>
      isLoading ? (
        <>
          <Skeleton style={styles.partDescriptionSkeleton} loading={true} />
          <Skeleton style={styles.partDescriptionSkeleton} loading={true} />
          <Skeleton style={styles.partDescriptionSkeleton} loading={true} />
        </>
      ) : (
        <LText semiBold>{metadata?.description || "-"}</LText>
      ),
    [isLoading, metadata],
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.main}>
        <Skeleton
          style={styles.tokenName}
          width={113}
          height={8}
          loading={isLoading}
        >
          <LText style={styles.tokenName}>{metadata.tokenName || "-"}</LText>
        </Skeleton>

        <Skeleton
          style={styles.nftName}
          width={250}
          height={12}
          loading={isLoading}
        >
          <LText style={styles.nftName} semiBold>
            {metadata.nftName || "-"}
          </LText>
        </Skeleton>

        <NftImage
          style={styles.image}
          height={windowWidth}
          width={windowWidth}
          src={metadata.media}
          borderRadius={8}
        />

        <View style={styles.buttons}>
          <View style={styles.sendButtonContainer}>
            <Button
              type="primary"
              IconLeft={SendIcon}
              containerStyle={styles.sendButton}
              title={t("account.send")}
              onPress={() => {}}
            />
          </View>
          <View style={styles.ellipsisButtonContainer}>
            <Button
              type="primary"
              containerStyle={styles.ellipsisButton}
              title="•••"
              onPress={() => {}}
            />
          </View>
        </View>
      </View>

<<<<<<< Updated upstream
      {/* This weird thing is because we want a full width scrollView withtout the paddings */}
      <>
        <View style={{ paddingLeft: MAIN_HORIZONTAL_PADDING }}>
          <LText style={styles.sectionTitle}>
            {t("nft.viewer.properties")}
          </LText>
        </View>
        {properties}
      </>
=======
        {/* This weird thing is because we want a full width scrollView withtout the paddings */}
        <>
          <View style={styles.propertiesContainer}>
            <LText style={styles.sectionTitle}>
              {t("nft.viewer.properties")}
            </LText>
          </View>
          {properties}
        </>
>>>>>>> Stashed changes

      <View style={styles.main}>
        <View style={styles.hr} />

        <Section title={t("nft.viewer.about")}>{description}</Section>

        <View style={styles.hr} />

        <Section
          title={t("nft.viewer.tokenContract")}
          value={collection.contract}
        />

        <View style={styles.hr} />

        <Section title={t("nft.viewer.tokenId")} value={nft.tokenId} />

        <View style={styles.hr} />

        <Section
          title={t("nft.viewer.quantity")}
          value={nft.amount.toFixed()}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    paddingTop: 8,
    paddingBottom: 64,
  },
  main: {
    paddingHorizontal: 16,
  },
  tokenNameSkeleton: {
    height: 8,
    width: 113,
    borderRadius: 4,
  },
  tokenName: {
    fontSize: 15,
    marginBottom: 4,
  },
  nftNameSkeleton: {
    height: 12,
    width: 250,
    borderRadius: 4,
  },
  nftName: {
    fontSize: 24,
    marginBottom: 24,
  },
  imageContainer: {
    borderRadius: 8,
    marginBottom: 32,
    ...Platform.select({
      android: {
        elevation: 1,
      },
      ios: {
        shadowOpacity: 0.2,
        shadowRadius: 14,
        shadowOffset: {
          height: 6,
          width: 0,
        },
      },
    }),
  },
  image: {
    borderRadius: 8,
    overflow: "hidden",
    width: "100%",
    aspectRatio: 1,
  },
  buttons: {
    paddingBottom: 32,
    flexWrap: "nowrap",
    flexDirection: "row",
    justifyContent: "center",
  },
  sendButtonContainer: {
    flexGrow: 1,
    flexShrink: 1,
    marginRight: 16,
    zIndex: 2,
    ...Platform.select({
      android: {
        elevation: 1,
      },
      ios: {
        shadowOpacity: 0.2,
        shadowRadius: 14,
        shadowOffset: {
          height: 6,
          width: 0,
        },
      },
    }),
  },
  sendButton: {
    borderRadius: 100,
  },
  ellipsisButtonContainer: {
    flexShrink: 0,
    width: 48,
    zIndex: 2,
    ...Platform.select({
      android: {
        elevation: 1,
      },
      ios: {
        shadowOpacity: 0.2,
        shadowRadius: 14,
        shadowOffset: {
          height: 6,
          width: 0,
        },
      },
    }),
  },
  ellipsisButton: {
    position: "relative",
    borderRadius: 48,
    paddingHorizontal: 0,
  },
  propertiesContainer: {
    paddingLeft: 16,
  },
  properties: {
    flexDirection: "row",
    marginTop: 6,
    paddingHorizontal: 16,
  },
  property: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginRight: 16,
    borderRadius: 4,
  },
  propertySekeletonOne: {
    height: 52,
    width: 60,
    borderRadius: 4,
  },
  propertySekeletonTwo: {
    height: 52,
    width: 80,
    borderRadius: 4,
  },
  propertySekeletonThree: {
    height: 52,
    width: 60,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 6,
    color: "grey",
  },
  partDescriptionSkeleton: {
    marginBottom: 10,
    height: 12,
    width: "100%",
  },
  hr: {
    flex: 1,
    height: 1,
    backgroundColor: "#DFDFDF",
    marginVertical: 24,
  },
});

export default NftViewer;
