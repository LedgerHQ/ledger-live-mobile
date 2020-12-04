/* @flow */
import React, { useEffect, useReducer } from "react";
import _ from "lodash";
import { saveTourData, getTourData } from "../../db";

export const STEPS = {
  INSTALL_CRYPTO: [],
  CREATE_ACCOUNT: ["INSTALL_CRYPTO"],
  RECEIVE_COINS: ["CREATE_ACCOUNT"],
  /*
  "BUY_COINS",
  "SEND_COINS",
  "SWAP_COINS",
  */
  CUSTOMIZE_APP: [], // optional
};

type State = {
  completedSteps: string[],
  dismissed: boolean,
  currentStep: string | null,
  initDone: boolean,
};

// actions
export let setStep: (step: string | null) => void = () => {};
export let completeStep: (step: string) => void = () => {};
export let dismiss: (dismissed: boolean) => void = () => {};

// reducer
const reducer = (state: State, update) => {
  return {
    ...state,
    ...update,
    completedSteps: update.dismissed
      ? []
      : _.uniq([...state.completedSteps, ...(update.completedSteps || [])]),
  };
};
const initialState = {
  completedSteps: [],
  dismissed: false,
  currentStep: null,
  initDone: false,
};

export const context = React.createContext<State>(initialState);

const Provider = ({ children }: { children: React$Node }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // actions
  setStep = currentStep => dispatch({ currentStep });
  completeStep = step => dispatch({ completedSteps: [step] });
  dismiss = dismissed => dispatch({ dismissed });

  // effects

  useEffect(() => {
    if (state.initDone) {
      return;
    }

    const init = async () => {
      dispatch({
        ...((await getTourData()) || initialState),
        initDone: true,
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
