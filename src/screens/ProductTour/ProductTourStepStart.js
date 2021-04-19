// @flow

import React, { useCallback, useContext, useMemo, useState } from "react";
import { Trans } from "react-i18next";
import {
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Dimensions,
  Pressable,
  Platform,
} from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import { useHeaderHeight } from "@react-navigation/stack";
import { useTheme } from "@react-navigation/native";
import LText from "../../components/LText";
import Button from "../../components/Button";
import AnimatedSvgBackground from "../../components/AnimatedSvgBackground";
import { context } from "./Provider";
import { NavigatorName, ScreenName } from "../../const";
import { navigate } from "../../rootnavigation";
import ArrowRight from "../../icons/ArrowRight";
import InfoCircle from "../../icons/Info";
import { urls } from "../../config/urls";
import { track } from "../../analytics";
import ArrowLeft from "../../icons/ArrowLeft";
import Styles from "../../navigation/styles";
import StartWithBitcoinBottomModal from "./StartWithBitcoinBottomModal";

const stepInfos = {
  INSTALL_CRYPTO: [
    "producttour.stepstart.installcrypto",
    [
      { desc: "producttour.stepstart.installcryptodetails" },
      {
        desc: "producttour.stepstart.installcryptodetails2",
        link: {
          href: urls.productTour.app,
          label: "producttour.stepstart.installcryptolink",
        },
      },
    ],
    {
      file: require("../../images/producttour/blue/installcrypto.png"),
      size: {
        width: 131,
        height: 151,
      },
    },
  ],
  CREATE_ACCOUNT: [
    "producttour.stepstart.createaccount",
    [
      { desc: "producttour.stepstart.createaccountdetails" },
      {
        desc: "producttour.stepstart.createaccountdetails2",
        link: {
          href: urls.productTour.addAccount,
          label: "producttour.stepstart.createaccountlink",
        },
      },
    ],
    {
      file: require("../../images/producttour/blue/createaccount.png"),
      size: {
        width: 148,
        height: 148,
      },
      offset: {
        left: -13,
      },
    },
  ],
  RECEIVE_COINS: [
    "producttour.stepstart.receivecoins",
    [
      { desc: "producttour.stepstart.receivecoinsdetails" },
      {
        desc: "producttour.stepstart.receivecoinsdetails2",
        link: {
          href: urls.productTour.receive,
          label: "producttour.stepstart.receivecoinslink",
        },
      },
    ],
    {
      file: require("../../images/producttour/blue/receivecoins.png"),
      size: {
        width: 149,
        height: 160,
      },
    },
  ],
  SEND_COINS: [
    "producttour.stepstart.sendcoins",
    [
      { desc: "producttour.stepstart.sendcoinsdetails" },
      {
        desc: "producttour.stepstart.sendcoinsdetails2",
        link: {
          href: urls.productTour.send,
          label: "producttour.stepstart.sendcoinslink",
        },
      },
    ],
    {
      file: require("../../images/producttour/blue/sendcoins.png"),
      size: {
        width: 216,
        height: 161,
      },
    },
  ],
  CUSTOMIZE_APP: [
    "producttour.stepstart.customizeapp",
    [{ desc: "producttour.stepstart.customizeappdetails" }],
    {
      file: require("../../images/producttour/blue/customizeapp.png"),
      size: {
        width: 156,
        height: 160,
      },
    },
  ],
};

const initialLayout = { width: Dimensions.get("window").width };

const ProductTourStepStart = ({ navigation }: *) => {
  const { colors } = useTheme();
  const ptContext = useContext(context);
  const headerHeight = useHeaderHeight();
  const [index, setIndex] = useState(0);
  const [modal, setModal] = useState();
  const scenes = useMemo(
    () => (ptContext.currentStep ? stepInfos[ptContext.currentStep][1] : []),
    [ptContext.currentStep],
  );
  const routes = useMemo(() => scenes.map((v, i) => ({ key: `${i}` })), [
    scenes,
  ]);

  const goTo = useCallback(() => {
    switch (ptContext.currentStep) {
      case "INSTALL_CRYPTO":
        setModal({
          Component: StartWithBitcoinBottomModal,
          props: {
            isOpened: true,
            onPress: () => {
              setModal();
              navigate(NavigatorName.Main, {
                screen: ScreenName.Portfolio,
              });
            },
          },
        });
        break;
      case "CREATE_ACCOUNT":
      case "RECEIVE_COINS":
      case "SEND_COINS":
        navigate(NavigatorName.Main, {
          screen: ScreenName.Portfolio,
        });
        break;
      case "CUSTOMIZE_APP":
        navigate(NavigatorName.Base, {
          screen: NavigatorName.CustomizeApp,
        });
        break;
      default:
        break;
    }
  }, [ptContext.currentStep]);

  const next = useCallback(() => {
    if (index === scenes.length - 1) {
      track(
        `step start tour ${ptContext.currentStep ? ptContext.currentStep : ""}`,
      );
      goTo();
    } else setIndex(index + 1);
  }, [goTo, index, ptContext.currentStep, scenes.length]);

  const onBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const renderScene = SceneMap(
    scenes.reduce(
      (sum, { desc, link }, i) => ({
        ...sum,
        [i]: () => (
          <View>
            {desc && (
              <LText style={styles.details}>
                <Trans i18nKey={desc} />
              </LText>
            )}
            {link && (
              <TouchableOpacity
                style={styles.link}
                onPress={() => Linking.openURL(link.href)}
              >
                <LText bold style={styles.linkText}>
                  <Trans i18nKey={link.label} />
                </LText>
                <InfoCircle size={16} color="#FFF" />
              </TouchableOpacity>
            )}
          </View>
        ),
      }),
      {},
    ),
  );

  if (!ptContext.currentStep) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.live }]}>
      {modal?.Component ? <modal.Component {...modal.props} /> : null}
      <AnimatedSvgBackground
        color={"#587ED4"}
        style={[styles.svg, { height: 218 - headerHeight }]}
      />
      <View style={[styles.header]}>
        <View style={styles.topHeader}>
          <Pressable style={styles.buttons} onPress={onBack}>
            <ArrowLeft size={18} color={"#FFF"} />
          </Pressable>
          <View style={styles.spacer} />
        </View>
      </View>
      <View style={styles.root}>
        <View style={styles.container}>
          <Image
            source={stepInfos[ptContext.currentStep][2]?.file}
            style={[
              styles.image,
              stepInfos[ptContext.currentStep][2]?.size,
              stepInfos[ptContext.currentStep][2]?.offset,
            ]}
          />
          <LText style={styles.title} bold>
            <Trans i18nKey={stepInfos[ptContext.currentStep][0]} />
          </LText>
          <TabView
            renderTabBar={() => null}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
          />
          <View style={styles.dotContainer}>
            {scenes.map((k, i) => (
              <View
                key={i}
                style={[styles.dot, index === i ? {} : styles.dotInactive]}
              >
                <View />
              </View>
            ))}
          </View>
        </View>
        <Button
          type="negativePrimary"
          onPress={next}
          title={<Trans i18nKey="producttour.stepstart.cta" />}
          IconRight={ArrowRight}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  root: {
    paddingHorizontal: 16,
    flex: 1,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    color: "#FFF",
    marginBottom: 8,
  },
  details: {
    fontSize: 16,
    color: "#FFF",
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 12,
  },
  linkText: {
    fontSize: 12,
    color: "#FFF",
    marginRight: 5,
  },
  image: {
    alignSelf: "center",
    marginBottom: 21,
    position: "relative",
  },
  svg: {
    position: "absolute",
    left: -16,
    right: -16,
    zIndex: -1,
    top: 0,
  },
  dotContainer: {
    position: "absolute",
    bottom: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    zIndex: 0,
  },
  dot: {
    width: 8,
    height: 8,
    margin: 4,
    borderRadius: 8,
    backgroundColor: "#FFF",
  },
  dotInactive: {
    opacity: 0.2,
  },
  topHeader: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
  },
  spacer: { flex: 1 },
  header: {
    ...Styles.headerNoShadow,
    backgroundColor: "transparent",
    width: "100%",
    paddingTop: Platform.OS === "ios" ? 0 : 40,
    flexDirection: "column",
    overflow: "hidden",
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  buttons: {
    paddingVertical: 16,
  },
  skipBuyButton: {
    backgroundColor: "transparent",
    paddingRight: 0,
  },
});

export default ProductTourStepStart;
