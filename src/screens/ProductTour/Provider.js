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

// actions
export let setStep: (step: string | null) => void = () => {};
export let completeStep: (step: string) => void = () => {};
export let dismiss: (dismissed: boolean) => void = () => {};
export let enableHole: (holeConfig: *) => void = () => {};
export let reportLayout: (ptIds: [string], ref: *) => void = () => {};

// reducer
const reducer = (state: State, update) => ({
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
});
const initialState = {
  completedSteps: [],
  dismissed: true,
  currentStep: null,
  initDone: false,
  holeConfig: null,
  layouts: {},
};

export const context = React.createContext<State>(initialState);

export const useProductTourOverlay = (step, holeConfig: string) => {
  const ptContext = useContext(context);

  useFocusEffect(
    useCallback(() => {
      if (ptContext.currentStep === step) {
        enableHole(holeConfig);
      }

      return () => enableHole(null);
    }, [holeConfig, ptContext.currentStep, step]),
  );
};

const Provider = ({ children }: { children: React$Node }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // actions
  setStep = currentStep => dispatch({ currentStep });
  completeStep = step => dispatch({ completedSteps: [step] });
  dismiss = dismissed => dispatch({ dismissed });
  enableHole = holeConfig => dispatch({ holeConfig });
  reportLayout = (ptIds = [], ref) => {
    ref.current.measure((_1, _2, width, height, x, y) => {
      ptIds.forEach(ptId => {
        dispatch({ layouts: { [ptId]: { width, height, x, y } } });
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
