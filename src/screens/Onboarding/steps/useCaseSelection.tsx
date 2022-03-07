import React, { useCallback, useMemo } from "react";
import { Platform, SectionList } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Icons } from "@ledgerhq/native-ui/assets";
import { Flex, Text, Carousel } from "@ledgerhq/native-ui";
import Illustration from "../../../images/illustration/Illustration";
import { TrackScreen } from "../../../analytics";
import Touchable from "../../../components/Touchable";
import { ScreenName } from "../../../const";
import OnboardingView from "../OnboardingView";

// @TODO Replace
const images = {
  light: {
    setupNano: require("../../../images/illustration/Light/_072.png"),
    pairNew: require("../../../images/illustration/Light/_076.png"),
    syncCrypto: require("../../../images/illustration/Light/_074.png"),
    restoreRecoveryPhrase: require("../../../images/illustration/Light/_067.png"),
  },
  dark: {
    setupNano: require("../../../images/illustration/Dark/_072.png"),
    pairNew: require("../../../images/illustration/Dark/_076.png"),
    syncCrypto: require("../../../images/illustration/Dark/_074.png"),
    restoreRecoveryPhrase: require("../../../images/illustration/Dark/_067.png"),
  },
};

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
    <Touchable
      event={item.event}
      eventProperties={{ deviceId: deviceModelId }}
      testID={`${item.event}|${deviceModelId}`}
      onPress={() => next(item)}
    >
      <Flex
        p={6}
        justifyContent="flex-start"
        maxWidth={cardMaxWidth}
        minHeight={368}
        border="1px solid"
        borderColor="palette.neutral.c30"
        borderRadius="4px"
      >
        <Flex alignItems="center">{item.Illustration}</Flex>
        <Text variant="h4" mt={7}>
          {t(item.title)}
        </Text>
        <Text variant="paragraph" mt={2}>
          {t(item.subTitle)}
        </Text>
        <Flex flex={1} />
        <Flex flexDirection="row" justifyContent="flex-end" mt={10}>
          <Icons.ArrowRightMedium size={16} />
        </Flex>
      </Flex>
    </Touchable>
  );
};

const Item = ({ cards }: { cards: Array<Card> }) => {
  if (cards.length === 1) return <Card item={cards[0]} />;

  return (
    <Carousel
      slideIndicatorContainerProps={{ style: { display: "none" } }}
      scrollViewProps={{
        contentContainerStyle: {
          width: `${66 * cards.length}%`,
          marginBottom: 16,
        },
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
      Platform.OS === "ios" && deviceModelId !== "nanoX"
        ? [
            {
              title: "v3.onboarding.stepUseCase.recovery",
              data: [
                {
                  cards: [
                    {
                      route: ScreenName.OnboardingImportAccounts,
                      Illustration: (
                        <Illustration
                          size={150}
                          darkSource={images.dark.syncCrypto}
                          lightSource={images.light.syncCrypto}
                        />
                      ),
                      title:
                        "v3.onboarding.stepUseCase.deviceActions.desktopSync.title",
                      subTitle:
                        "v3.onboarding.stepUseCase.deviceActions.desktopSync.subTitle",
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
              title: t("v3.onboarding.stepUseCase.firstUse"),
              data: [
                {
                  cards: [
                    {
                      route: "OnboardingModalSetupNewDevice",
                      Illustration: (
                        <Illustration
                          size={150}
                          darkSource={images.dark.setupNano}
                          lightSource={images.light.setupNano}
                        />
                      ),
                      title:
                        "v3.onboarding.stepUseCase.deviceActions.setup.title",
                      subTitle:
                        "v3.onboarding.stepUseCase.deviceActions.setup.subTitle",
                      event: "Onboarding - Setup new",
                    },
                  ],
                },
              ],
            },
            {
              title: "v3.onboarding.stepUseCase.recovery",
              data: [
                {
                  cards: [
                    {
                      route: ScreenName.OnboardingPairNew,
                      Illustration: (
                        <Illustration
                          size={150}
                          darkSource={images.dark.pairNew}
                          lightSource={images.light.pairNew}
                        />
                      ),
                      title:
                        "v3.onboarding.stepUseCase.deviceActions.pairing.title",
                      subTitle:
                        "v3.onboarding.stepUseCase.deviceActions.pairing.subTitle",
                      event: "Onboarding - Connect",
                      showRecoveryWarning: true,
                    },
                    {
                      route: ScreenName.OnboardingImportAccounts,
                      Illustration: (
                        <Illustration
                          size={150}
                          darkSource={images.dark.syncCrypto}
                          lightSource={images.light.syncCrypto}
                        />
                      ),
                      title:
                        "v3.onboarding.stepUseCase.deviceActions.desktopSync.title",
                      subTitle:
                        "v3.onboarding.stepUseCase.deviceActions.desktopSync.subTitle",
                      event: "Onboarding - Setup Import Accounts",
                    },
                    {
                      route: ScreenName.OnboardingRecoveryPhrase,
                      Illustration: (
                        <Illustration
                          size={150}
                          darkSource={images.dark.restoreRecoveryPhrase}
                          lightSource={images.light.restoreRecoveryPhrase}
                        />
                      ),
                      title:
                        "v3.onboarding.stepUseCase.deviceActions.restore.title",
                      subTitle:
                        "v3.onboarding.stepUseCase.deviceActions.restore.subTitle",
                      event: "Onboarding - Restore",
                    },
                  ],
                },
              ],
            },
          ],
    [deviceModelId, t],
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