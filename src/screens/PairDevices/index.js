// @flow
import React, { useReducer, useCallback, useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { useDispatch, useSelector } from "react-redux";
import Config from "react-native-config";
import { first, filter, timeout, tap } from "rxjs/operators";
import getDeviceInfo from "@ledgerhq/live-common/lib/hw/getDeviceInfo";
import getDeviceName from "@ledgerhq/live-common/lib/hw/getDeviceName";
import { listApps } from "@ledgerhq/live-common/lib/apps/hw";
import { delay } from "@ledgerhq/live-common/lib/promise";
import logger from "../../logger";
import TransportBLE from "../../react-native-hw-transport-ble";
import { GENUINE_CHECK_TIMEOUT } from "../../constants";
import { addKnownDevice } from "../../actions/ble";
import { installAppFirstTime } from "../../actions/settings";
import { hasCompletedOnboardingSelector } from "../../reducers/settings";
import colors from "../../colors";
import RequiresBLE from "../../components/RequiresBLE";
import PendingPairing from "./PendingPairing";
import PendingGenuineCheck from "./PendingGenuineCheck";
import Paired from "./Paired";
import Scanning from "./Scanning";
import ScanningTimeout from "./ScanningTimeout";
import RenderError from "./RenderError";
import { e2eBridgeSubject } from "../../e2e-bridge";

type Props = {
  navigation: any,
  route: { params: RouteParams },
};

type RouteParams = {
  onDone?: (deviceId: string) => void,
};

export default function PairDevices(props: Props) {
  return (
    <RequiresBLE>
      <SafeAreaView forceInset={forceInset} style={styles.root}>
        <PairDevicesInner {...props} />
      </SafeAreaView>
    </RequiresBLE>
  );
}

function PairDevicesInner({ navigation, route }: Props) {
  const hasCompletedOnboarding = useSelector(hasCompletedOnboardingSelector);
  const dispatchRedux = useDispatch();

  const [
    { error, status, device, skipCheck, genuineAskedOnDevice, name },
    dispatch,
  ] = useReducer(reducer, initialState);

  const unmounted = useRef(false);

  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  const onTimeout = useCallback(() => {
    dispatch({ type: "timeout" });
  }, [dispatch]);

  const onRetry = useCallback(() => {
    dispatch({ type: "scanning" });
  }, [dispatch]);

  const onError = useCallback(
    (error: Error) => {
      logger.critical(error);
      dispatch({ type: "error", payload: error });
    },
    [dispatch],
  );

  const onSelect = useCallback(
    async (device: Device) => {
      dispatch({ type: "pairing", payload: device });
      // if (Config.MOCK) {
      //   await e2eBridgeSubject
      //     .pipe(
      //       filter(msg => msg.type === "open"),
      //       first(),
      //     )
      //     .toPromise();
      //   if (unmounted.current) return;
      //   const deviceInfo = await getDeviceInfo(transport);
      //   return;
      // }
      try {
        const transport = await TransportBLE.open(device);
        if (unmounted.current) return;
        try {
          const deviceInfo = await getDeviceInfo(transport);
          if (__DEV__) console.log({ deviceInfo }); // eslint-disable-line no-console
          if (unmounted.current) return;

          dispatch({ type: "genuinecheck", payload: device });

          await listApps(transport, deviceInfo)
            .pipe(
              timeout(GENUINE_CHECK_TIMEOUT),
              tap(e => {
                if (e.type === "result") {
                  if (!hasCompletedOnboarding) {
                    const hasAnyAppInstalled =
                      e.result && e.result.installed.length > 0;

                    if (!hasAnyAppInstalled) {
                      dispatchRedux(installAppFirstTime(false));
                    }
                  }

                  return;
                }
                dispatch({
                  type: "allowManager",
                  payload: e.type === "allow-manager-requested",
                });
              }),
            )
            .toPromise();

          if (unmounted.current) return;

          const name = (await getDeviceName(transport)) || device.name;
          if (unmounted.current) return;

          dispatchRedux(addKnownDevice({ id: device.id, name }));
          if (unmounted.current) return;
          dispatch({ type: "paired" });
        } finally {
          transport.close();
          await TransportBLE.disconnect(device.id).catch(() => {});
          await delay(500);
        }
      } catch (error) {
        if (unmounted.current) return;
        console.warn(error);
        onError(error);
      }
    },
    [dispatch, dispatchRedux, hasCompletedOnboarding, onError],
  );

  const onBypassGenuine = useCallback(() => {
    if (device) {
      dispatchRedux(
        addKnownDevice({ id: device.id, name: name || device.name }),
      );
      dispatch({ type: "paired" });
    } else {
      dispatch({ type: "scanning" });
    }
  }, [device, dispatchRedux, name, dispatch]);

  const onDone = useCallback(
    (deviceId: string) => {
      navigation.goBack();
      route.params?.onDone?.(deviceId);
    },
    [navigation, route],
  );

  if (error) {
    return (
      <RenderError
        status={status}
        error={error}
        onRetry={onRetry}
        onBypassGenuine={onBypassGenuine}
      />
    );
  }

  switch (status) {
    case "scanning":
      return (
        <Scanning onSelect={onSelect} onError={onError} onTimeout={onTimeout} />
      );
    case "timedout":
      return <ScanningTimeout onRetry={onRetry} />;
    case "pairing":
      return <PendingPairing />;
    case "genuinecheck":
      return (
        <PendingGenuineCheck genuineAskedOnDevice={genuineAskedOnDevice} />
      );
    case "paired":
      return device ? (
        <Paired
          deviceName={device.name}
          deviceId={device.id}
          genuine={!skipCheck}
          onContinue={onDone}
        />
      ) : null;
    default:
      return null;
  }
}

const forceInset = { bottom: "always" };

const initialState: State = {
  status: "scanning",
  device: null,
  name: null,
  error: null,
  skipCheck: false,
  genuineAskedOnDevice: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "timeout":
      return { ...state, status: "timeout" };
    case "retry":
      return { ...state, status: "scanning", error: null, device: null };
    case "error":
      return { ...state, error: action.payload };
    case "pairing":
      return {
        ...state,
        status: "pairing",
        genuineAskedOnDevice: false,
        device: action.payload,
      };
    case "genuinecheck":
      return { ...state, status: "genuinecheck", device: action.payload };
    case "allowManager":
      return { ...state, genuineAskedOnDevice: action.payload };
    case "paird":
      return { ...state, status: "paired", error: null, skipCheck: true };
    case "scanning":
      return { ...state, status: "scanning", error: null, device: null };
    default:
      return state;
  }
}

type State = {
  status: "scanning" | "pairing" | "genuinecheck" | "paired" | "timedout",
  device: ?Device,
  name: ?string,
  error: ?Error,
  skipCheck: boolean,
  genuineAskedOnDevice: boolean,
};

type Device = {
  id: string,
  name: string,
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
