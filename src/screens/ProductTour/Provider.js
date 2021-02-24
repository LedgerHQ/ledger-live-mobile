/* @flow */
import React, {
  useEffect,
  useReducer,
  useCallback,
  useContext,
  useState,
} from "react";
import { InteractionManager } from "react-native";
import _ from "lodash";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { saveTourData, getTourData } from "../../db";
import { hasInstalledAnyAppSelector } from "../../reducers/settings";

export const STEPS = {
  INSTALL_CRYPTO: [],
  CREATE_ACCOUNT: ["INSTALL_CRYPTO"],
  RECEIVE_COINS: ["CREATE_ACCOUNT"],
  BUY_COINS: ["CREATE_ACCOUNT"],
  SEND_COINS: ["CREATE_ACCOUNT"],
  SWAP_COINS: ["CREATE_ACCOUNT"],
  CUSTOMIZE_APP: [],
};

type State = {
  completedSteps: string[],
  dismissed: boolean,
  currentStep: string | null,
  initDone: boolean,
  holeConfig: string | null,
  layouts: *,
  finishedModal: string | null,
};
type StateUpdate = {
  completedSteps?: string[],
  dismissed?: boolean,
  currentStep?: string | null,
  initDone?: boolean,
  holeConfig?: string | null,
  layouts?: *,
  finishedModal?: string | null,
};

// actions
export let setStep: (step: string | null) => void = () => {};
export let completeStep: (step: string) => void = () => {};
export let skipCurrentStep: () => void = () => {};
export let dismiss: (dismissed: boolean) => void = () => {};
export let enableHole: (holeConfig: *) => void = () => {};
export let enableFinishedModal: (
  finishedModal: string | null,
) => void = () => {};
export let reportLayout: (
  ptIds: [string],
  ref: *,
  extra: *,
  mins: *,
) => void = () => {};

// reducer
const reducer = (state: State, update: StateUpdate) => {
  if (update.holeConfig && update.holeConfig.substring(0, 1) === "-") {
    if (state.holeConfig && update.holeConfig === `-${state.holeConfig}`) {
      // eslint-disable-next-line no-param-reassign
      update.holeConfig = null;
    } else {
      // eslint-disable-next-line no-param-reassign
      delete update.holeConfig;
    }
  }
  if (update.currentStep && update.currentStep.substring(0, 1) === "-") {
    if (state.currentStep && update.currentStep === `-${state.currentStep}`) {
      // eslint-disable-next-line no-param-reassign
      update.currentStep = null;
    } else {
      // eslint-disable-next-line no-param-reassign
      delete update.currentStep;
    }
  }
  if (update.dismissed) {
    // eslint-disable-next-line no-param-reassign
    update.holeConfig = null;
  }
  return {
    ...state,
    ...update,
    completedSteps: update.dismissed
      ? []
      : _.uniq([...state.completedSteps, ...(update.completedSteps || [])]),
    layouts: update.layouts
      ? {
          ...state.layouts,
          ...update.layouts,
        }
      : state.layouts,
  };
};
const initialState = {
  completedSteps: [],
  dismissed: true,
  currentStep: null,
  initDone: false,
  holeConfig: null,
  layouts: {},
  finishedModal: null,
};

export const context = React.createContext<State>(initialState);

export const useProductTourOverlay = (
  step: string,
  holeConfig: string,
  enabled: boolean = true,
) => {
  const ptContext = useContext(context);

  useFocusEffect(
    useCallback(() => {
      if (
        ptContext.currentStep === step &&
        enabled &&
        // auto kill overlay finish modal is displayed (useful on the receive flow)
        !ptContext.finishedModal
      ) {
        enableHole(holeConfig);
        return () => enableHole(`-${holeConfig}`);
      }

      return () => {};
    }, [
      ptContext.currentStep,
      ptContext.finishedModal,
      step,
      enabled,
      holeConfig,
    ]),
  );
};

export const useProductTourFinishedModal = (step: string, enabled: boolean) => {
  const ptContext = useContext(context);
  const [disabled, setDisabled] = useState(
    enabled && ptContext.currentStep !== step,
  );

  // console.log(step, enabled, disabled);

  useEffect(() => {
    if (ptContext.currentStep === null && enabled) {
      setDisabled(true);
    }
    if (!enabled) {
      setDisabled(false);
    }
  }, [ptContext.currentStep, enabled]);

  useEffect(() => {
    if (ptContext.currentStep === step && enabled && !disabled) {
      enableFinishedModal(step);
    }
  }, [ptContext.currentStep, step, enabled, disabled]);
};

const Provider = ({ children }: { children: React$Node }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const hasInstalledAnyApp = useSelector(hasInstalledAnyAppSelector);

  // actions
  setStep = currentStep => dispatch({ currentStep });
  completeStep = step => dispatch({ completedSteps: [step] });
  skipCurrentStep = () => dispatch({ currentStep: null });
  dismiss = dismissed => dispatch({ dismissed });
  enableHole = holeConfig => dispatch({ holeConfig });
  enableFinishedModal = finishedModal => dispatch({ finishedModal });
  reportLayout = (ptIds = [], ref, extra = {}, mins = {}) => {
    InteractionManager.runAfterInteractions(() => {
      if (!ref.current) {
        return;
      }
      ref.current.measure((_1, _2, width, height, x, y) => {
        // console.log("reports", ptIds, { width, height, x, y })
        if (mins.height && height < mins.height) {
          return;
        }
        ptIds.forEach(ptId => {
          dispatch({
            layouts: {
              [ptId]: {
                width: width + 10 + (extra.width || 0),
                height: height + 10 + (extra.height || 0),
                x: x - 5 + (extra.x || 0),
                y: y - 5 + (extra.y || 0),
              },
            },
          });
        });
      });
    });
  };

  // effects

  useEffect(() => {
    if (state.initDone && hasInstalledAnyApp) {
      completeStep("INSTALL_CRYPTO");
    }
  }, [hasInstalledAnyApp, state.initDone]);

  useEffect(() => {
    if (state.initDone) {
      return;
    }

    const init = async () => {
      dispatch({
        ...initialState,
        ...((await getTourData()) || {}),
        initDone: true,
      });
    };

    init();
  }, [hasInstalledAnyApp, state.initDone]);

  useEffect(() => {
    if (!state.initDone) {
      return;
    }
    saveTourData(_.pick(state, "completedSteps", "dismissed"));
  }, [state, state.initDone]);

  return <context.Provider value={state}>{children}</context.Provider>;
};

//

export default Provider;
