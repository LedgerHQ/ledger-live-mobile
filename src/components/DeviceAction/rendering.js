// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import { WrongDeviceForAccount, UnexpectedBootloader } from "@ledgerhq/errors";
import type { TokenCurrency } from "@ledgerhq/live-common/lib/types";
import LText from "../LText";
import getWindowDimensions from "../../logic/getWindowDimensions";
import Spinning from "../Spinning";
import LiveLogo from "../../icons/LiveLogoIcon";
import colors from "../../colors";
import Button from "../Button";
import { NavigatorName } from "../../const";
import Warning from "../../icons/Warning";
import AlertTriangle from "../../icons/AlertTriangle";
import Animation from "../Animation";
import getDeviceAnimation from "./getDeviceAnimation";
import TranslatedError from "../TranslatedError";

type RawProps = {
  t: (key: string, options?: { [key: string]: string }) => string,
};

type ModelId = "nanoX" | "nanoS";

export function renderRequestQuitApp({
  t,
  modelId,
}: {
  ...RawProps,
  modelId: ModelId,
}) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.animationContainer}>
        <Animation source={getDeviceAnimation({ modelId, key: "quitApp" })} />
      </View>
      <LText style={styles.text} semiBold>
        {t("DeviceAction.quitApp")}
      </LText>
    </View>
  );
}

export function renderRequiresAppInstallation({
  t,
  navigation,
  appName,
}: {
  ...RawProps,
  navigation: any,
  appName: string,
}) {
  return (
    <View style={styles.wrapper}>
      <LText style={styles.text} semiBold>
        {t("DeviceAction.appNotInstalled", { appName })}
      </LText>
      <View style={styles.actionContainer}>
        <Button
          event="DeviceActionRequiresAppInstallationOpenManager"
          type="primary"
          title={t("DeviceAction.button.openManager")}
          onPress={() => navigation.navigate(NavigatorName.Manager)}
          containerStyle={styles.button}
        />
      </View>
    </View>
  );
}

export function renderAllowManager({
  t,
  modelId,
  wording,
}: {
  ...RawProps,
  modelId: ModelId,
  wording: string,
}) {
  // TODO: disable gesture, modal close, hide header buttons
  return (
    <View style={styles.wrapper}>
      <View style={styles.animationContainer}>
        <Animation
          source={getDeviceAnimation({ modelId, key: "allowManager" })}
        />
      </View>
      <LText style={styles.text} semiBold>
        {t("DeviceAction.allowManagerPermission", { wording })}
      </LText>
    </View>
  );
}

export function renderAllowOpeningApp({
  t,
  navigation,
  modelId,
  wording,
  tokenContext,
  isDeviceBlocker,
}: {
  ...RawProps,
  navigation: any,
  modelId: ModelId,
  wording: string,
  tokenContext?: ?TokenCurrency,
  isDeviceBlocker?: boolean,
}) {
  if (isDeviceBlocker) {
    // TODO: disable gesture, modal close, hide header buttons
    navigation.setOptions({
      gestureEnabled: false,
    });
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.animationContainer}>
        <Animation source={getDeviceAnimation({ modelId, key: "openApp" })} />
      </View>
      <LText style={styles.text} semiBold>
        {t("DeviceAction.allowAppPermission", { wording })}
      </LText>
      {tokenContext ? (
        <LText style={styles.text} semiBold>
          {t("DeviceAction.allowAppPermissionSubtitleToken", {
            token: tokenContext.name,
          })}
        </LText>
      ) : null}
    </View>
  );
}

export function renderInWrongAppForAccount({
  t,
  onRetry,
  accountName,
}: {
  ...RawProps,
  accountName: string,
  onRetry?: () => void,
}) {
  return renderError({
    t,
    error: new WrongDeviceForAccount(null, { accountName }),
    onRetry,
  });
}

export function renderError({
  t,
  error,
  onRetry,
}: {
  ...RawProps,
  error: Error,
  onRetry?: () => void,
}) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.iconContainer}>
        <AlertTriangle size={28} />
      </View>
      <LText style={[styles.text, styles.title]} bold>
        <TranslatedError error={error} field="description" />
      </LText>
      {onRetry && (
        <View style={styles.actionContainer}>
          <Button
            event="DeviceActionErrorRetry"
            type="primary"
            title={t("common.retry")}
            onPress={onRetry}
            containerStyle={styles.button}
          />
        </View>
      )}
    </View>
  );
}

export function renderConnectYourDevice({
  t,
  modelId,
  unresponsive,
}: {
  ...RawProps,
  modelId: ModelId,
  unresponsive: boolean,
}) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.animationContainer}>
        <Animation
          source={getDeviceAnimation({
            modelId,
            key: unresponsive ? "enterPinCode" : "plugAndPinCode",
          })}
        />
      </View>
      <LText style={styles.text} semiBold>
        {t(
          unresponsive
            ? "DeviceAction.unlockDevice"
            : "DeviceAction.connectAndUnlockDevice",
        )}
      </LText>
    </View>
  );
}

export function renderLoading({ t }: RawProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.spinnerContainer}>
        <Spinning>
          <LiveLogo size={32} color={colors.grey} />
        </Spinning>
      </View>
      <LText style={styles.text}>{t("DeviceAction.loading")}</LText>
    </View>
  );
}

type WarningOutdatedProps = {
  ...RawProps,
  navigation: any,
  appName: string,
  passWarning: () => void,
};

export function renderWarningOutdated({
  t,
  navigation,
  appName,
  passWarning,
}: WarningOutdatedProps) {
  function onOpenManager() {
    navigation.navigate(NavigatorName.Manager);
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.iconContainer}>
        <Warning size={28} color={colors.yellow} />
      </View>
      <LText style={[styles.text, styles.title]} bold>
        {t("DeviceAction.outdated")}
      </LText>
      <LText style={[styles.text, styles.description]} semiBold>
        {t("DeviceAction.outdatedDesc", { appName })}
      </LText>
      <View style={styles.actionContainer}>
        <Button
          event="DeviceActionWarningOutdatedContinue"
          type="secondary"
          title={t("common.continue")}
          onPress={passWarning}
          outline={false}
          containerStyle={styles.button}
        />
        <Button
          event="DeviceActionWarningOutdatedOpenManager"
          type="primary"
          title={t("DeviceAction.button.openManager")}
          onPress={onOpenManager}
          containerStyle={styles.button}
        />
      </View>
    </View>
  );
}

export function renderBootloaderStep({ t }: RawProps) {
  return renderError({
    t,
    error: new UnexpectedBootloader(),
  });
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 160,
  },
  anim: {
    width: getWindowDimensions().width - 2 * 16,
  },
  text: {
    color: colors.darkBlue,
  },
  iconContainer: {
    padding: 8,
  },
  title: {
    padding: 8,
  },
  description: {
    color: colors.grey,
    padding: 8,
  },
  spinnerContainer: {
    padding: 24,
  },
  button: {
    margin: 8,
  },
  actionContainer: {
    flexDirection: "row",
    padding: 8,
  },
  animationContainer: {
    alignSelf: "stretch",
    height: 180,
  },
});
