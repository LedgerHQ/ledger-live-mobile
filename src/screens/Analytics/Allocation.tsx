import React, { useCallback } from "react";
import { Dimensions, FlatList } from "react-native";
import styled from "styled-components/native";
import { Flex, Text } from "@ledgerhq/native-ui";
import { useTheme } from "styled-components/native";
import { useTranslation } from "react-i18next";
import RingChart from "./RingChart";
import { useDistribution } from "../../actions/general";
import DistributionCard, { DistributionItem } from "./DistributionCard";

const Container = styled(Flex).attrs({
  paddingHorizontal: 16,
  paddingVertical: 20,
})``;

const AssetWrapperContainer = styled(Flex).attrs({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: "center",
  alignItems: "center",
})``;

export default function Allocation() {
  const size = Dimensions.get("window").width * (1 / 2);
  const distribution = useDistribution();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const renderItem = useCallback(
    ({ item }: { item: DistributionItem; index: number }) => (
      <DistributionCard item={item} />
    ),
    [],
  );

  return (
    <Container alignItems="center">
      <Flex>
        <Flex>
          <RingChart size={size} data={distribution.list} colors={colors} />
        </Flex>
        <AssetWrapperContainer pointerEvents="none">
          <Text variant="h1" fontWeight="medium" color="neutral.c100">
            {distribution.list.length}
          </Text>
          <Text variant="body" fontWeight="medium" color="neutral.c80">
            {t("distribution.assets", { count: distribution.list.length })}
          </Text>
        </AssetWrapperContainer>
      </Flex>
      <FlatList
        data={distribution.list}
        renderItem={renderItem}
        keyExtractor={item => item.currency.id}
        style={{ width: "100%" }}
      />
    </Container>
  );
}
