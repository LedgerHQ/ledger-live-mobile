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

export const HOLES = {
  "Porfolio-AccountsTab": [],
};

type State = {
  completedSteps: string[],
  dismissed: boolean,
  currentStep: string | null,
  initDone: boolean,
  holeConfig: string | null,
};

// actions
export let setStep: (step: string | null) => void = () => {};
export let completeStep: (step: string) => void = () => {};
export let dismiss: (dismissed: boolean) => void = () => {};
export let enableHole: (holeConfig: *) => void = () => {};

// reducer
const reducer = (state: State, update) => ({
  ...state,
  ...update,
  completedSteps: update.dismissed
    ? []
    : _.uniq([...state.completedSteps, ...(update.completedSteps || [])]),
});
const initialState = {
  completedSteps: [],
  dismissed: true,
  currentStep: null,
  initDone: false,
  holeConfig: null,
};

export const context = React.createContext<State>(initialState);

export const useProductTourOverlay = (holeConfig: string) => {
  const ptContext = useContext(context);

  useFocusEffect(
    useCallback(() => {
      if (
        ptContext.currentStep === "INSTALL_CRYPTO" &&
        !ptContext.holeConfig !== holeConfig
      ) {
        console.log("enable hole");
        enableHole(holeConfig);
      }

      return () => enableHole(null);
    }, [holeConfig, ptContext.currentStep, ptContext.holeConfig]),
  );
};

const Provider = ({ children }: { children: React$Node }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // actions
  setStep = currentStep => dispatch({ currentStep });
  completeStep = step => dispatch({ completedSteps: [step] });
  dismiss = dismissed => dispatch({ dismissed });
  enableHole = holeConfig => dispatch({ holeConfig });

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
        holeDismissed: false,
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
