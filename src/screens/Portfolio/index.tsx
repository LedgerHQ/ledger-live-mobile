import React, { useRef, useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { FlatList, LayoutChangeEvent, Platform } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { createNativeWrapper } from "react-native-gesture-handler";
import { Trans } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";
import { isAccountEmpty } from "@ledgerhq/live-common/lib/account";

import { Box, Flex, Link as TextLink, Text } from "@ledgerhq/native-ui";

import styled from "styled-components/native";
import { FlexBoxProps } from "@ledgerhq/native-ui/components/Layout/Flex";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRefreshAccountsOrdering } from "../../actions/general";
import { accountsSelector } from "../../reducers/accounts";
import {
  discreetModeSelector,
  counterValueCurrencySelector,
  carouselVisibilitySelector,
} from "../../reducers/settings";
import { usePortfolio } from "../../actions/portfolio";
import globalSyncRefreshControl from "../../components/globalSyncRefreshControl";

import GraphCardContainer from "./GraphCardContainer";
import Carousel from "../../components/Carousel";
import Header from "./Header";
import TrackScreen from "../../analytics/TrackScreen";
import MigrateAccountsBanner from "../MigrateAccounts/Banner";
import RequireTerms from "../../components/RequireTerms";
import { useScrollToTop } from "../../navigation/utils";
import { NavigatorName, ScreenName } from "../../const";
import FabActions from "../../components/FabActions";
import FirmwareUpdateBanner from "../../components/FirmwareUpdateBanner";
import DiscoverSection from "./DiscoverSection";
import AddAssetsCard from "./AddAssetsCard";
import Assets from "./Assets";
import MarketSection from "./MarketSection";

export { default as PortfolioTabIcon } from "./TabIcon";

const AnimatedFlatListWithRefreshControl = createNativeWrapper(
  Animated.createAnimatedComponent(globalSyncRefreshControl(FlatList)),
  {
    disallowInterruption: true,
    shouldCancelWhenOutside: false,
  },
);

type Props = {
  navigation: any;
};

const ContentContainer = styled(SafeAreaView)`
  flex: 1;
`;

const SectionTitle = ({
  title,
  onSeeAllPress,
  navigatorName,
  screenName,
  navigation,
  seeMoreText,
  containerProps,
}: {
  title: React.ReactElement;
  onSeeAllPress?: () => void;
  navigatorName?: string;
  screenName?: string;
  navigation?: any;
  seeMoreText?: React.ReactElement;
  containerProps?: FlexBoxProps;
}) => {
  const onLinkPress = useCallback(() => {
    if (onSeeAllPress) {
      onSeeAllPress();
    }
    if (navigation && navigatorName) {
      navigation.navigate(navigatorName, { screen: screenName });
    }
  }, [onSeeAllPress, navigation, navigatorName, screenName]);

  return (
    <Flex
      flexDirection={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      mb={6}
      {...containerProps}
    >
      <Text variant={"h3"} textTransform={"uppercase"} mt={2}>
        {title}
      </Text>
      {onSeeAllPress || navigatorName ? (
        <TextLink onPress={onLinkPress} type={"color"}>
          {seeMoreText || <Trans i18nKey={"common.seeAll"} />}
        </TextLink>
      ) : null}
    </Flex>
  );
};

export default function PortfolioScreen({ navigation }: Props) {
  const carouselVisibility = useSelector(carouselVisibilitySelector);
  const accounts = useSelector(accountsSelector);
  const counterValueCurrency = useSelector(counterValueCurrencySelector);
  const portfolio = usePortfolio();
  const discreetMode = useSelector(discreetModeSelector);

  const refreshAccountsOrdering = useRefreshAccountsOrdering();
  useFocusEffect(refreshAccountsOrdering);

  const [graphCardEndPosition, setGraphCardEndPosition] = useState(0);
  const currentPositionY = useSharedValue(0);
  const handleScroll = useAnimatedScrollHandler(event => {
    currentPositionY.value = event.contentOffset.y;
  });
  const ref = useRef();
  useScrollToTop(ref);

  const flatListRef = useRef();

  const onPortfolioCardLayout = useCallback((event: LayoutChangeEvent) => {
    const { y, height } = event.nativeEvent.layout;
    setGraphCardEndPosition(y + height);
  }, []);

  const areAccountsEmpty = useMemo(() => accounts.every(isAccountEmpty), [
    accounts,
  ]);
  const showAssets = accounts.length > 0;
  const maxAssetsToDisplay = 3;
  const assetsToDisplay = accounts.slice(0, maxAssetsToDisplay);

  const data = useMemo(
    () => [
      <Box bg={"background.main"}>
        <Header
          counterValueCurrency={counterValueCurrency}
          portfolio={portfolio}
          currentPositionY={currentPositionY}
          graphCardEndPosition={graphCardEndPosition}
          hidePortfolio={areAccountsEmpty}
        />
      </Box>,
      !showAssets && (
        <Box mx={6} mt={3}>
          <AddAssetsCard />
        </Box>
      ),
      <Box mx={6} mt={3} onLayout={onPortfolioCardLayout}>
        <GraphCardContainer
          counterValueCurrency={counterValueCurrency}
          portfolio={portfolio}
          showGreeting={!areAccountsEmpty}
          showGraphCard={!areAccountsEmpty}
        />
      </Box>,
      ...(accounts.length > 0
        ? [
            <Box mx={6} mt={6}>
              <FabActions />
            </Box>,
          ]
        : []),
      ...(showAssets
        ? [
            <Flex mx={6} mt={10}>
              <SectionTitle
                title={<Trans i18nKey={"distribution.title"} />}
                navigation={navigation}
                navigatorName={NavigatorName.Accounts}
              />
              <Assets
                balanceHistory={portfolio.balanceHistory}
                flatListRef={flatListRef}
                assets={assetsToDisplay}
              />
            </Flex>,
          ]
        : []),
      <Flex mx={6} my={10}>
        <SectionTitle
          title={<Trans i18nKey={"portfolio.topGainers.title"} />}
          navigation={navigation}
          navigatorName={NavigatorName.Market}
          seeMoreText={<Trans i18nKey={"portfolio.topGainers.seeMarket"} />}
          containerProps={{ mb: 5 }}
        />
        <MarketSection />
      </Flex>,
      ...(Object.values(carouselVisibility).some(Boolean)
        ? [
            <Flex mb={10}>
              <Flex mx={6}>
                <SectionTitle
                  title={<Trans i18nKey={"portfolio.recommended.title"} />}
                />
              </Flex>
              <Carousel cardsVisibility={carouselVisibility} />
            </Flex>,
          ]
        : []),
      ...(Platform.OS !== "ios"
        ? [
            <Flex mb={10}>
              <Flex mx={6}>
                <SectionTitle
                  title={<Trans i18nKey={"tabs.platform"} />}
                  navigation={navigation}
                  navigatorName={NavigatorName.Discover}
                  screenName={ScreenName.PlatformCatalog}
                />
              </Flex>

              <DiscoverSection />
            </Flex>,
          ]
        : []),
    ],
    [
      counterValueCurrency,
      portfolio,
      currentPositionY,
      graphCardEndPosition,
      areAccountsEmpty,
      showAssets,
      onPortfolioCardLayout,
      accounts.length,
      navigation,
      assetsToDisplay,
      carouselVisibility,
    ],
  );

  return (
    <>
      <FirmwareUpdateBanner />
      <ContentContainer>
        <RequireTerms />

        <TrackScreen
          category="Portfolio"
          accountsLength={accounts.length}
          discreet={discreetMode}
        />

        <AnimatedFlatListWithRefreshControl
          ref={ref}
          data={data}
          style={{ flex: 1, position: "relative" }}
          renderItem={({ item }: { item: React.ReactNode }) => item}
          keyExtractor={(_: any, index: number) => String(index)}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
          onScroll={handleScroll}
          testID={
            accounts.length ? "PortfolioAccountsList" : "PortfolioEmptyAccount"
          }
        />
        <MigrateAccountsBanner />
      </ContentContainer>
    </>
  );
}
