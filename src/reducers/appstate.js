// @flow
/* eslint import/no-cycle: 0 */
import { handleActions } from "redux-actions";
import { createSelector } from "reselect";
import { NetworkDown } from "@ledgerhq/errors";
import type { State } from ".";

export type AsyncState = {
  isConnected: boolean,
};

export type AppState = {
  isConnected: boolean,
  dismissedCarousel: boolean,
};

const initialState: AppState = {
  isConnected: true,
  dismissedCarousel: false,
};

const handlers: Object = {
  SYNC_IS_CONNECTED: (
    state: AppState,
    { isConnected }: { isConnected: boolean },
  ) => ({
    ...state,
    isConnected,
  }),
  DISMISS_CAROUSEL: (state: AppState) => ({
    ...state,
    dismissedCarousel: !state.dismissedCarousel,
  }),
};

// Selectors

export const isConnectedSelector = (state: State) => state.appstate.isConnected;
export const dismissedCarouselSelector = (state: State) =>
  state.appstate.dismissedCarousel;

const globalNetworkDown = new NetworkDown();

// $FlowFixMe
export const networkErrorSelector = createSelector(
  isConnectedSelector,
  isConnected => (!isConnected ? globalNetworkDown : null),
);

export default handleActions(handlers, initialState);
