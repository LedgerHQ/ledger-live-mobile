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

/* TODO: Replace this as soon as design team give us the correct illustrations */
import Svg, { SvgProps, Path } from "react-native-svg";
const PlaceholderIllustation = (props: SvgProps) => (
  <Svg width={151} height={154} fill="none" {...props}>
    <Path
      d="M.2 0v2.139h1.1v-.244l.774.792.787-.769-.8-.818h.35V0H.2ZM6.832 0h4.422v1.1H6.832V0ZM15.676 1.1V0h4.421v1.1h-4.421ZM24.519 1.1V0h4.421v1.1H24.52ZM33.362 1.1V0h4.421v1.1h-4.421ZM42.205 1.1V0h4.422v1.1h-4.422ZM51.048 1.1V0h4.422v1.1h-4.422ZM59.891 1.1V0h4.422v1.1h-4.422ZM68.734 1.1V0h4.422v1.1h-4.422ZM77.578 1.1V0h4.421v1.1h-4.421ZM86.42 1.1V0h4.422v1.1h-4.421ZM95.264 1.1V0h4.422v1.1h-4.422ZM104.107 1.1V0h4.422v1.1h-4.422ZM112.95 1.1V0h4.422v1.1h-4.422ZM121.793 1.1V0h4.422v1.1h-4.422ZM130.636 1.1V0h4.422v1.1h-4.422ZM139.48 1.1V0h4.421v1.1h-4.421ZM148.323 1.1V0h2.211v2.139h-1.1v-.243l-.791.81-.787-.768.818-.838h-.351ZM149.434 6.417h1.1v4.277h-1.1V6.417ZM149.434 14.972h1.1v4.278h-1.1v-4.278ZM149.434 23.528h1.1v4.278h-1.1v-4.278ZM149.434 32.083h1.1v4.278h-1.1v-4.278ZM149.434 40.639h1.1v4.278h-1.1v-4.278ZM149.434 49.194h1.1v4.278h-1.1v-4.278ZM149.434 57.75h1.1v4.278h-1.1V57.75ZM149.434 66.305h1.1v4.278h-1.1v-4.278ZM149.434 74.861h1.1v4.278h-1.1V74.86ZM149.434 83.417h1.1v4.277h-1.1v-4.277ZM149.434 91.972h1.1v4.278h-1.1v-4.278ZM149.434 100.528h1.1v4.278h-1.1v-4.278ZM149.434 109.083h1.1v4.278h-1.1v-4.278ZM149.434 117.639h1.1v4.278h-1.1v-4.278ZM149.434 126.194h1.1v4.278h-1.1v-4.278ZM149.434 134.75h1.1v4.278h-1.1v-4.278ZM149.434 143.306h1.1v4.277h-1.1v-4.277ZM149.434 151.861h1.1V154h-2.211v-1.1h.351l-.76-.78.788-.768.732.751v-.242ZM143.901 152.9v1.1h-4.421v-1.1h4.421ZM135.058 152.9v1.1h-4.421v-1.1h4.421ZM126.215 152.9v1.1h-4.422v-1.1h4.422ZM117.372 152.9v1.1h-4.422v-1.1h4.422ZM108.529 152.9v1.1h-4.422v-1.1h4.422ZM99.686 152.9v1.1h-4.422v-1.1h4.422ZM90.842 152.9v1.1h-4.421v-1.1h4.421ZM82 152.9v1.1h-4.422v-1.1h4.421ZM73.156 152.9v1.1h-4.422v-1.1h4.422ZM64.313 152.9v1.1H59.89v-1.1h4.422ZM55.47 152.9v1.1h-4.422v-1.1h4.422ZM46.627 152.9v1.1h-4.422v-1.1h4.422ZM37.783 152.9v1.1h-4.421v-1.1h4.421ZM28.94 152.9v1.1H24.52v-1.1h4.421ZM20.097 152.9v1.1h-4.421v-1.1h4.421ZM11.254 152.9v1.1H6.833v-1.1h4.421ZM2.411 152.9v1.1H.201v-2.139h1.1v.243l.79-.81.787.768-.818.838h.351ZM1.3 147.583H.2v-4.277h1.1v4.277ZM1.3 139.028H.2v-4.278h1.1v4.278ZM1.3 130.472H.2v-4.278h1.1v4.278ZM1.3 121.917H.2v-4.278h1.1v4.278ZM1.3 113.361H.2v-4.278h1.1v4.278ZM1.3 104.806H.2v-4.278h1.1v4.278ZM1.3 96.25H.2v-4.278h1.1v4.278ZM1.3 87.695H.2v-4.278h1.1v4.278ZM1.3 79.139H.2V74.86h1.1v4.278ZM1.3 70.583H.2v-4.277h1.1v4.277ZM1.3 62.028H.2V57.75h1.1v4.278ZM1.3 53.472H.2v-4.278h1.1v4.278ZM1.3 44.917H.2v-4.278h1.1v4.278ZM1.3 36.361H.2v-4.278h1.1v4.278ZM1.3 27.806H.2v-4.278h1.1v4.278ZM1.3 19.25H.2v-4.278h1.1v4.278ZM1.3 10.694H.2V6.417h1.1v4.277ZM5.183 5.87 8.28 9.037l.787-.768L5.97 5.1l-.787.77ZM11.396 12.228l3.092 3.165.787-.769-3.092-3.165-.787.769ZM17.606 18.585l3.09 3.163.787-.768-3.09-3.164-.787.769ZM23.812 24.938l3.092 3.167.787-.769L24.6 24.17l-.787.768ZM30.016 31.291l3.096 3.17.786-.768-3.095-3.17-.787.768ZM36.22 37.646l3.098 3.172.788-.768-3.098-3.173-.787.769ZM42.425 44l3.1 3.176.787-.769-3.1-3.175-.787.769ZM48.63 50.356l3.101 3.177.787-.768-3.102-3.178-.787.769ZM54.833 56.71l3.104 3.181.788-.768-3.105-3.18-.787.768ZM92.057 94.856l3.108 3.186.788-.769-3.108-3.185-.788.768ZM98.266 101.219l3.098 3.176.788-.768-3.099-3.176-.787.768ZM104.475 107.584l3.08 3.157.787-.768-3.08-3.157-.787.768ZM110.68 113.944l3.091 3.17.788-.768-3.092-3.17-.787.768ZM116.872 120.292l3.116 3.194.787-.768-3.116-3.194-.787.768ZM123.075 126.651l3.095 3.173.787-.768-3.095-3.173-.787.768ZM129.291 133.025l3.106 3.185.788-.768-3.106-3.185-.788.768ZM135.495 139.386l3.1 3.178.788-.768-3.1-3.178-.788.768ZM141.704 145.752l3.098 3.177.787-.768-3.097-3.177-.788.768ZM145.542 5.884l-3.102 3.178-.787-.768 3.102-3.178.787.768ZM139.339 12.24l-3.101 3.177-.788-.768 3.102-3.178.787.769ZM133.136 18.595l-3.101 3.178-.787-.768 3.101-3.178.787.768ZM126.933 24.95l-3.101 3.178-.787-.768 3.101-3.177.787.768ZM120.731 31.306l-3.102 3.178-.787-.768 3.101-3.178.788.768ZM114.528 37.662l-3.101 3.178-.788-.769 3.102-3.177.787.768ZM108.325 44.017l-3.101 3.178-.788-.768 3.102-3.178.787.768ZM102.122 50.373l-3.101 3.178-.787-.769 3.101-3.177.787.768ZM95.92 56.729l-3.102 3.177-.787-.768 3.101-3.178.788.769ZM58.703 94.862 55.6 98.04l-.787-.769 3.102-3.177.787.768ZM52.5 101.217l-3.101 3.178-.788-.768 3.102-3.178.787.768ZM46.297 107.573l-3.101 3.178-.787-.768 3.101-3.178.787.768ZM40.094 113.929l-3.1 3.177-.788-.768 3.101-3.178.787.769ZM33.892 120.284l-3.102 3.178-.787-.768 3.102-3.178.787.768ZM27.689 126.64l-3.101 3.177-.788-.768 3.102-3.178.787.769ZM21.486 132.995l-3.101 3.178-.787-.768 3.1-3.178.788.768ZM15.283 139.351l-3.101 3.178-.787-.769 3.101-3.177.787.768ZM9.08 145.706l-3.1 3.178-.788-.768 3.101-3.178.788.768ZM15.535 70.604h-5.068v14.259h2.043V79.73h3.025c2.785 0 4.849-1.936 4.849-4.543 0-2.628-2.064-4.583-4.849-4.583Zm-3.025 7.252v-5.378h3.346c1.683 0 2.284.59 2.284 2.22v.937c0 1.63-.601 2.22-2.284 2.22H12.51ZM22.98 70.604v14.259h9.216v-1.874h-7.172V70.604H22.98ZM44.508 84.863l-3.926-14.26h-2.845l-4.047 14.26h2.084l.941-3.463h4.748l.902 3.463h2.143Zm-7.292-5.337 1.783-6.6h.28l1.703 6.6h-3.766ZM51.092 85.067c3.025 0 4.988-2.261 5.048-5.847h-2.203c0 3.036-.401 3.87-2.625 3.87h-.4c-1.864 0-2.765-.63-2.765-3.442v-3.83c0-2.81.901-3.442 2.764-3.442h.401c2.224 0 2.625.835 2.625 3.87h2.203c-.06-3.585-2.003-5.846-5.048-5.846-3.246 0-5.189 2.648-5.189 7.333 0 4.685 1.943 7.334 5.189 7.334ZM58.817 70.604v14.259h9.115v-1.874H60.86v-4.36h6.17v-1.873h-6.17v-4.278h6.772v-1.874h-8.815ZM77.801 78.61v6.253h2.043v-14.26h-2.043v6.112h-5.329v-6.111h-2.043v14.259h2.043v-6.254h5.329ZM87.169 85.067c3.326 0 5.189-2.648 5.189-7.334 0-4.746-1.864-7.333-5.19-7.333-3.345 0-5.228 2.587-5.228 7.333 0 4.665 1.903 7.334 5.229 7.334Zm-2.985-5.419v-3.83c0-2.851.901-3.442 2.764-3.442h.401c1.863 0 2.765.59 2.765 3.442v3.83c0 2.852-.902 3.443-2.765 3.443h-.4c-1.864 0-2.765-.611-2.765-3.443ZM95.054 70.604v14.259h9.216v-1.874h-7.172V70.604h-2.044ZM110.893 70.604h-4.327v14.259h4.367c3.827 0 5.249-2.954 5.249-7.13 0-4.237-1.523-7.13-5.289-7.13Zm-2.324 12.385V72.478h2.184c2.063 0 3.185.53 3.185 3.381v3.748c0 2.852-1.122 3.382-3.185 3.382h-2.184ZM118.879 70.604v14.259h9.115v-1.874h-7.072v-4.36h6.171v-1.873h-6.171v-4.278h6.772v-1.874h-8.815ZM137.863 81.461v3.402h2.043v-3.076c0-2.24-.521-3.096-2.123-3.34v-.286c1.462-.387 2.484-1.772 2.484-3.422 0-1.039-.401-1.976-1.162-2.73-.962-.937-2.244-1.405-3.907-1.405h-4.507v14.259h2.003V79.18h3.005c1.543 0 2.164.651 2.164 2.281Zm-5.169-4.155v-4.828h3.206c1.562 0 2.123.53 2.123 1.976v.855c0 1.487-.541 1.997-2.123 1.997h-3.206Z"
      fill="#000"
    />
  </Svg>
);

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
                      Illustration: <PlaceholderIllustation />,
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
                      route: ScreenName.OnboardingSetNewDeviceInfo,
                      Illustration: <PlaceholderIllustation />,
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
                      Illustration: <PlaceholderIllustation />,
                      title:
                        "onboarding.stepUseCase.deviceActions.pairing.title",
                      subTitle:
                        "onboarding.stepUseCase.deviceActions.pairing.subTitle",
                      event: "Onboarding - Connect",
                      showRecoveryWarning: true,
                    },
                    {
                      route: ScreenName.OnboardingImportAccounts,
                      Illustration: <PlaceholderIllustation />,
                      title:
                        "onboarding.stepUseCase.deviceActions.desktopSync.title",
                      subTitle:
                        "onboarding.stepUseCase.deviceActions.desktopSync.subTitle",
                      event: "Onboarding - Setup Import Accounts",
                    },
                    {
                      route: ScreenName.OnboardingRecoveryPhrase,
                      Illustration: <PlaceholderIllustation />,
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
          <Text variant="h2" style={{ textTransform: "uppercase", maxWidth: cardMaxWidth }}>
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
