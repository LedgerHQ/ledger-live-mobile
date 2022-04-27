import React, { useEffect, useRef } from 'react';
import assert from 'assert';
import { DappRequest } from '../../../use-case/dto/dapp-request';
import { Controller, RequestHandler, ResponseHandler } from '../../controller';

interface RequestProviderProps {
  children: React.ReactNode;
}

interface RequestState {
  request: DappRequest | undefined;
  handleResponse: ResponseHandler | undefined;
  handleComplete: (() => void) | undefined;
}

export type RequestAction =
  | {
      type: 'newRequest';
      requestState: RequestState;
    }
  | {
      type: 'completeRequest';
    };

const initialRequestState: RequestState = {
  request: undefined,
  handleResponse: undefined,
  handleComplete: undefined,
};

function accountReducer(state: RequestState, action: RequestAction): RequestState {
  switch (action.type) {
    case 'newRequest':
      return action.requestState;
    case 'completeRequest':
      return initialRequestState;
    default: {
      throw new Error(`Unhandled action type: ${action}`);
    }
  }
}

const RequestContext = React.createContext<RequestState | undefined>(undefined);

export function RequestProvider({ children }: RequestProviderProps): JSX.Element {
  const [state, dispatch] = React.useReducer(accountReducer, initialRequestState);
  const controllerRef = useRef<Controller>();
  const currentRequest = state.request;

  useEffect(() => {
    controllerRef.current = new Controller();
  }, []);

  useEffect(() => {
    const handleRequest: RequestHandler = (request, handleResponse): void => {
      console.log('+++ state', state);
      if (currentRequest) {
        console.log('[request-context] Request already in progress. Ignoring new request.', request);
        return;
      }
      console.log('[request-context] handle request', request);
      const handleComplete = () => {
        console.log('[request-context] handle complete', request);
        dispatch({ type: 'completeRequest' });
      };
      dispatch({ type: 'newRequest', requestState: { request, handleResponse, handleComplete } });
    };

    const controller = controllerRef.current;
    assert(controller, 'controller must be defined');

    controller.subscribe(handleRequest);

    return () => {
      controller.unsubscribe(handleRequest);
    };
  }, [currentRequest]);

  return <RequestContext.Provider value={state}>{children}</RequestContext.Provider>;
}

export function useRequest(): RequestState {
  const context = React.useContext(RequestContext);
  if (context === undefined) {
    throw new Error('useRequestState must be used within a RequestProvider');
  }
  return context;
}
