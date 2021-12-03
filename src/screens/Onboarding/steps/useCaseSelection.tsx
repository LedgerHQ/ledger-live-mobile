import React, { useCallback, useMemo } from "react";
import { Platform, SectionList } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Icons } from "@ledgerhq/native-ui/assets";
import { Flex, Text, Carousel } from "@ledgerhq/native-ui";

import { TrackScreen } from "../../../analytics";
import Touchable from "../../../components/Touchable";
import { ScreenName } from "../../../const";
import OnboardingView from "../OnboardingView";
import nanoS from "../assets/nanoS";
import PlaceholderIllustration from "./PlaceholderIllustration";

type CurrentRouteType = RouteProp<
  { params: { deviceModelId: string } },
  "params"
>;

type Card = {
  title: string;
  subTitle: string;
  route: string;
  showRecoveryWarning?: boolean;
  Illustration: React.ReactNode;
  // For analytics purpose
  event: string;
};

// Magic number
const cardMaxWidth = 248;

const Card = ({ item }: { item: Card }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<CurrentRouteType>();
  const { deviceModelId } = route.params;

  const next = useCallback(
    ({ route: targetRoute, next }: { route: string; next?: string }) => {
      const showSeedWarning = [
        ScreenName.OnboardingRecoveryPhrase,
        ScreenName.OnboardingPairNew,
      ].includes(targetRoute);

      // TODO: FIX @react-navigation/native using Typescript
      // @ts-ignore next-line
      navigation.navigate(targetRoute, {
        ...route.params,
        next,
        showSeedWarning,
      });
    },
    [navigation, route],
  );

  return (
    <Flex
      p={6}
      justifyContent="flex-end"
      maxWidth={cardMaxWidth}
      minHeight={368}
      border="1px solid"
      borderColor="palette.neutral.c30"
      borderRadius="4px"
    >
      <Touchable
        event={item.event}
        eventProperties={{ deviceId: deviceModelId }}
        testID={`${item.event}|${deviceModelId}`}
        onPress={() => next(item)}
      >
        <Flex alignItems="center">{item.Illustration}</Flex>
        <Text variant="h4" mt={7}>
          {t(item.title)}
        </Text>
        <Text variant="paragraph" mt={2}>
          {t(item.subTitle)}
        </Text>
        <Flex flexDirection="row" justifyContent="flex-end" mt={10}>
          <Icons.ArrowRightMedium size={16} />
        </Flex>
      </Touchable>
    </Flex>
  );
};

const Item = ({ cards }: { cards: Array<Card> }) => {
  if (cards.length === 1) return <Card item={cards[0]} />;

  return (
    <Carousel
      slideIndicatorContainerProps={{ style: { display: "none" } }}
      scrollViewProps={{
        contentContainerStyle: { width: `${90 * cards.length}%` },
        pagingEnabled: false,
      }}
    >
      {cards.map(card => (
        <Card item={card} key={card.title} />
      ))}
    </Carousel>
  );
};

const OnboardingStepUseCaseSelection = () => {
  const { t } = useTranslation();
  const route = useRoute<CurrentRouteType>();
  const { deviceModelId } = route.params;

  const useCases = useMemo(
    () =>
      Platform.OS === "ios" && deviceModelId === nanoS.id
        ? [
            {
              title: "onboarding.stepUseCase.recovery",
              data: [
                {
                  cards: [
                    {
                      route: ScreenName.OnboardingImportAccounts,
                      Illustration: <PlaceholderIllustration />,
                      title:
                        "onboarding.stepUseCase.deviceActions.desktopSync.title",
                      subTitle:
                        "onboarding.stepUseCase.deviceActions.desktopSync.subTitle",
                      event: "Onboarding - Setup Import Accounts",
                      showRecoveryWarning: true,
                    },
                  ],
                },
              ],
            },
          ]
        : [
            {
              title: t("onboarding.stepUseCase.firstUse"),
              data: [
                {
                  cards: [
                    {
                      route: "OnboardingSetupNewDevice",
                      Illustration: <PlaceholderIllustration />,
                      title: "onboarding.stepUseCase.deviceActions.setup.title",
                      subTitle:
                        "onboarding.stepUseCase.deviceActions.setup.subTitle",
                      event: "Onboarding - Setup new",
                    },
                  ],
                },
              ],
            },
            {
              title: "onboarding.stepUseCase.recovery",
              data: [
                {
                  cards: [
                    {
                      route: ScreenName.OnboardingPairNew,
                      Illustration: <PlaceholderIllustration />,
                      title:
                        "onboarding.stepUseCase.deviceActions.pairing.title",
                      subTitle:
                        "onboarding.stepUseCase.deviceActions.pairing.subTitle",
                      event: "Onboarding - Connect",
                      showRecoveryWarning: true,
                    },
                    {
                      route: ScreenName.OnboardingImportAccounts,
                      Illustration: <PlaceholderIllustration />,
                      title:
                        "onboarding.stepUseCase.deviceActions.desktopSync.title",
                      subTitle:
                        "onboarding.stepUseCase.deviceActions.desktopSync.subTitle",
                      event: "Onboarding - Setup Import Accounts",
                    },
                    {
                      route: ScreenName.OnboardingRecoveryPhrase,
                      Illustration: <PlaceholderIllustration />,
                      title:
                        "onboarding.stepUseCase.deviceActions.restore.title",
                      subTitle:
                        "onboarding.stepUseCase.deviceActions.restore.subTitle",
                      event: "Onboarding - Restore",
                    },
                  ],
                },
              ],
            },
          ],
    [deviceModelId],
  );

  return (
    <OnboardingView hasBackButton>
      <SectionList
        sections={useCases}
        renderSectionHeader={({ section }) => (
          <Text
            variant="h2"
            style={{ textTransform: "uppercase", maxWidth: cardMaxWidth }}
          >
            {t(section.title)}
          </Text>
        )}
        renderItem={({ item }) => <Item cards={item.cards} />}
        SectionSeparatorComponent={({ leadingItem }) => (
          <Flex mt={leadingItem ? "9" : "8"} />
        )}
        stickySectionHeadersEnabled={false}
      />
      <TrackScreen category="Onboarding" name="UseCase" />
    </OnboardingView>
  );
};

export default OnboardingStepUseCaseSelection;
