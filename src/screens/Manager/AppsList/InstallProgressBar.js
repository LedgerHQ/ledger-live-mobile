import React, {
  useState,
  useCallback,
  useMemo,
  useContext,
  useEffect,
} from "react";
import { Linking } from "react-native";
import { Trans } from "react-i18next";
import type { State } from "@ledgerhq/live-common/lib/apps";
import { isLiveSupportedApp } from "@ledgerhq/live-common/lib/apps/logic";

import { useTheme } from "@react-navigation/native";
import { urls } from "../../../config/urls";
import { ScreenName, NavigatorName } from "../../../const";
import ToastBar from "../../../components/ToastBar";
import {
  context as _ptContext,
  completeStep,
} from "../../ProductTour/Provider";
import ProductTourStepFinishedBottomModal from "../../ProductTour/ProductTourStepFinishedBottomModal";
import { navigate } from "../../../rootnavigation";

type Props = {
  state: State,
  navigation: *,
  disable: boolean,
};

const InstallSuccessBar = ({ state, navigation, disable }: Props) => {
  const ptContext = useContext(_ptContext);
  const { colors } = useTheme();
  const [hasBeenShown, setHasBeenShown] = useState(disable);
  const [hideProductTourModal, setHideProductTourModal] = useState(true);
  const {
    installQueue,
    uninstallQueue,
    recentlyInstalledApps,
    appByName,
    installed,
  } = state;

  const onAddAccount = useCallback(() => {
    navigation.navigate(NavigatorName.AddAccounts);
    setHasBeenShown(true);
  }, [navigation]);

  const goToProductTourMenu = () => {
    completeStep(ptContext.currentStep);
    navigate(NavigatorName.ProductTour, {
      screen: ScreenName.ProductTourMenu,
    });
    setHideProductTourModal(true);
  };
  useEffect(() => {
    setHideProductTourModal(ptContext.currentStep !== "INSTALL_CRYPTO");
  }, [ptContext.currentStep]);

  const onSupportLink = useCallback(() => {
    Linking.openURL(urls.appSupport);
    setHasBeenShown(true);
  }, []);

  const successInstalls = useMemo(
    () =>
      !hasBeenShown && installQueue.length <= 0 && uninstallQueue.length <= 0
        ? recentlyInstalledApps
            .filter(appName => installed.some(({ name }) => name === appName))
            .map(name => appByName[name])
        : [],
    [
      appByName,
      hasBeenShown,
      installQueue.length,
      recentlyInstalledApps,
      uninstallQueue.length,
      installed,
    ],
  );

  const hasLiveSupported = useMemo(
    () => successInstalls.find(isLiveSupportedApp),
    [successInstalls],
  );

  const onClose = useCallback(() => setHasBeenShown(true), []);

  return (
    <>
      <ProductTourStepFinishedBottomModal
        isOpened={
          recentlyInstalledApps.length >= 1 &&
          ptContext.currentStep === "INSTALL_CRYPTO" &&
          !hideProductTourModal
        }
        onPress={() => goToProductTourMenu()}
        onClose={() => goToProductTourMenu()}
      />
      <ToastBar
        isOpened={
          successInstalls.length >= 1 &&
          ptContext.currentStep !== "INSTALL_CRYPTO"
        }
        onClose={onClose}
        containerStyle={{ backgroundColor: colors.live }}
        type={"primary"}
        title={
          <>
            {hasLiveSupported ? (
              successInstalls.length === 1 ? (
                <Trans
                  i18nKey="manager.installSuccess.title"
                  values={{ app: successInstalls[0].name }}
                />
              ) : (
                <Trans i18nKey="manager.installSuccess.title_plural" />
              )
            ) : (
              <Trans i18nKey="manager.installSuccess.notSupported" />
            )}
          </>
        }
        secondaryAction={{
          title: <Trans i18nKey="manager.installSuccess.later" />,
          onPress: onClose,
        }}
        primaryAction={
          hasLiveSupported
            ? {
                title: <Trans i18nKey="manager.installSuccess.manageAccount" />,
                useTouchable: true,
                onPress: onAddAccount,
                event: "ManagerAddAccount",
              }
            : {
                title: <Trans i18nKey="manager.installSuccess.learnMore" />,
                onPress: onSupportLink,
              }
        }
      />
    </>
  );
};

export default InstallSuccessBar;
