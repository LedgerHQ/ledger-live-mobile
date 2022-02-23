import React, {
  useRef,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { FlatList, LayoutChangeEvent } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { createNativeWrapper } from "react-native-gesture-handler";
import { Trans } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";
import { isAccountEmpty } from "@ledgerhq/live-common/lib/account";

import { Box, Flex, Link, Text } from "@ledgerhq/native-ui";

import styled from "styled-components/native";
import { useRefreshAccountsOrdering } from "../../actions/general";
import { accountsSelector } from "../../reducers/accounts";
import {
  counterValueCurrencySelector,
  carouselVisibilitySelector,
} from "../../reducers/settings";
import { usePortfolio } from "../../actions/portfolio";
import globalSyncRefreshControl from "../../components/globalSyncRefreshControl";

import GraphCardContainer from "./GraphCardContainer";
import Carousel from "../../components/Carousel";
import Header from "./Header";
import extraStatusBarPadding from "../../logic/extraStatusBarPadding";
import TrackScreen from "../../analytics/TrackScreen";
import MigrateAccountsBanner from "../MigrateAccounts/Banner";
import RequireTerms from "../../components/RequireTerms";
import { useScrollToTop } from "../../navigation/utils";
import { NavigatorName } from "../../const";
import FabActions from "../../components/FabActions";
import FirmwareUpdateBanner from "../../components/FirmwareUpdateBanner";
import DiscoverSection from "./DiscoverSection";
import AddAssetsCard from "./AddAssetsCard";
import Assets from "./Assets";
import { setCarouselVisibility } from "../../actions/settings";

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

const ContentContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${p => p.theme.colors.palette.background.main};
  padding-top: ${() => extraStatusBarPadding}px;
`;

const SectionTitle = ({
  title,
  onSeeAllPress,
  navigatorName,
  navigation,
}: {
  title: React.ReactElement;
  onSeeAllPress?: () => void;
  navigatorName?: keyof typeof NavigatorName;
  navigation?: any;
}) => {
  const onLinkPress = useCallback(() => {
    if (onSeeAllPress) {
      onSeeAllPress();
    }
    if (navigation && navigatorName) {
      navigation.navigate(navigatorName);
    }
  }, [navigation, onSeeAllPress, navigatorName]);

  return (
    <Flex
      flexDirection={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      mb={6}
    >
      <Text variant={"h3"} textTransform={"uppercase"} mt={2}>
        {title}
      </Text>
      {(onSeeAllPress || navigatorName) && (
        <Link onPress={onLinkPress} type={"color"}>
          <Trans i18nKey={"common.seeAll"} />
        </Link>
      )}
    </Flex>
  );
};

export default function PortfolioScreen({ navigation }: Props) {
  const carouselVisibility = useSelector(carouselVisibilitySelector);
  const accounts = useSelector(accountsSelector);
  const counterValueCurrency = useSelector(counterValueCurrencySelector);
  const portfolio = usePortfolio();
  const dispatch = useDispatch();

  const refreshAccountsOrdering = useRefreshAccountsOrdering();
  useFocusEffect(refreshAccountsOrdering);

  const [graphCardEndPosition, setGraphCardEndPosition] = useState(0);

  const currentPositionY = useSharedValue(0);
  const handleScroll = useAnimatedScrollHandler(event => {
    currentPositionY.value = event.contentOffset.y;
  });

  const ref = useRef();
  useScrollToTop(ref);

  const areAccountsEmpty = useMemo(() => accounts.every(isAccountEmpty), [
    accounts,
  ]);

  const flatListRef = useRef();

  const showAssets = accounts.length > 0;

  const maxAssetsToDisplay = 3;
  const assetsToDisplay = accounts.slice(0, maxAssetsToDisplay);

  // useEffect(() => {
  //   dispatch(
  //     setCarouselVisibility({
  //       ...carouselVisibility,
  //       buyCrypto: true,
  //       FamilyPack: true,
  //       LedgerAcademy: true,
  //       Swap: true,
  //     }),
  //   );
  // }, []);

  const data = useMemo(
    () => [
      <Box bg={"background.main"}>
        <Header
          counterValueCurrency={counterValueCurrency}
          portfolio={portfolio}
          currentPositionY={currentPositionY}
          graphCardEndPosition={graphCardEndPosition}
        />
      </Box>,
      !accounts.length && (
        <Box mx={6} mt={3}>
          <AddAssetsCard />
        </Box>
      ),
      <Box
        mx={6}
        mt={3}
        onLayout={(event: LayoutChangeEvent) => {
          const { y, height } = event.nativeEvent.layout;
          setGraphCardEndPosition(y + height);
        }}
      >
        <GraphCardContainer
          counterValueCurrency={counterValueCurrency}
          portfolio={portfolio}
          showGreeting={!areAccountsEmpty}
          showGraphCard={!areAccountsEmpty}
        />
      </Box>,
      accounts.length > 0 && (
        <Box mx={6} mt={6}>
          <FabActions />
        </Box>
      ),
      ...(showAssets
        ? [
            <Flex mx={6} mt={10}>
              <SectionTitle
                title={<Trans i18nKey={"v3.distribution.title"} />}
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
      <Flex mx={6} mt={10}>
        <SectionTitle
          title={<Trans i18nKey={"tabs.platform"} />}
          navigation={navigation}
          navigatorName={NavigatorName.Platform}
        />
        <DiscoverSection />
      </Flex>,
      ...(Object.values(carouselVisibility).some(cardVisible => cardVisible)
        ? [
            <Flex mx={6} mt={10}>
              <SectionTitle
                title={<Trans i18nKey={"v3.portfolio.recommended.title"} />}
              />
              <Carousel cardsVisibility={carouselVisibility} />
            </Flex>,
          ]
        : []),
      <Box mt={24} />,
    ],
    [
      accounts.length,
      areAccountsEmpty,
      assetsToDisplay,
      counterValueCurrency,
      navigation,
      portfolio,
      showAssets,
      carouselVisibility,
    ],
  );

  return (
    <>
      <FirmwareUpdateBanner />
      <ContentContainer>
        <RequireTerms />

        <TrackScreen category="Portfolio" accountsLength={accounts.length} />

        <AnimatedFlatListWithRefreshControl
          ref={ref}
          data={data}
          style={{ flex: 1, position: "relative" }}
          renderItem={({ item }) => item}
          keyExtractor={(item, index) => String(index)}
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
