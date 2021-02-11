/* @flow */
import React, { useEffect, useReducer, useCallback, useContext } from "react";
import _ from "lodash";
import { useFocusEffect } from "@react-navigation/native";
import { saveTourData, getTourData } from "../../db";

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
};
type StateUpdate = {
  completedSteps?: string[],
  dismissed?: boolean,
  currentStep?: string | null,
  initDone?: boolean,
  holeConfig?: string | null,
  layouts?: *,
};

// actions
export let setStep: (step: string | null) => void = () => {};
export let completeStep: (step: string) => void = () => {};
export let dismiss: (dismissed: boolean) => void = () => {};
export let enableHole: (holeConfig: *) => void = () => {};
export let reportLayout: (ptIds: [string], ref: *, extra: *) => void = () => {};

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
      if (ptContext.currentStep === step && enabled) {
        enableHole(holeConfig);
        return () => enableHole(`-${holeConfig}`);
      }

      return () => {};
    }, [ptContext.currentStep, step, holeConfig, enabled]),
  );
};

const Provider = ({ children }: { children: React$Node }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // actions
  setStep = currentStep => dispatch({ currentStep });
  completeStep = step => dispatch({ completedSteps: [step] });
  dismiss = dismissed => dispatch({ dismissed });
  enableHole = holeConfig => dispatch({ holeConfig });
  reportLayout = (ptIds = [], ref, extra = {}) => {
    ref.current.measure((_1, _2, width, height, x, y) => {
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
  };

  // effects

  useEffect(() => {
    if (state.initDone) {
      return;
    }

    const init = async () => {
      dispatch({
        ...((await getTourData()) || initialState),
        initDone: true,
        currentStep: null,
        holeConfig: null,
        layouts: {},
      });
    };

    init();
  }, [state.initDone]);
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
