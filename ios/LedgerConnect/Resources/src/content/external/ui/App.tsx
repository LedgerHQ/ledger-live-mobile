import React from 'react';
import styled from 'styled-components';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import { DappConnectionFlow } from './panels/dapp-connection';
import { TransactionFlow } from './panels/transaction';
import { ChainProvider } from './hooks/chain-context';
import { RequestProvider, useRequest } from './hooks/request-context';
import { RequestType } from '../../use-case/dto/dapp-request';
import { PersonalMessageFlow } from './panels/personal-message';

Sentry.init({
  dsn: 'https://61343ca99885431bb2360f3ea6ce3443@o1196144.ingest.sentry.io/6319296',
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});

const Container = styled.div`
  z-index: 999999;
  position: fixed;
  background-color: rgb(0, 0, 13, 0.7);
  width: 100%;
  height: 100%;
`;

// const usePreprocessing = (
//   request: DappRequest | undefined,
//   handleResponse: ResponseHandler | undefined,
// ): DappResponse | undefined => {
//   if (!request || !request.isDappConnection()) {
//     return;
//   }
//   // check for stored accounts
// };

function RequestConsumer(): JSX.Element | null {
  const { request } = useRequest();

  console.log('[App] request', request);

  // TODO: https://trello.com/c/NZ0B16gM/47-remember-connections-to-a-specific-dapp
  // const requiresUI = usePreprocessing(request, handleResponse);

  if (!request) {
    return null;
  }

  const chain = request.getChain();
  const type = request.getType();

  console.log('[App] render');

  return (
    <AlertProvider
      template={AlertTemplate}
      position={positions.TOP_CENTER}
      offset="30px"
      transition={transitions.SCALE}
      containerStyle={{ zIndex: 1000000, textTransform: 'initial' }}
    >
      <ChainProvider chain={chain}>
        <Container>
          {type === RequestType.ConnectDapp && <DappConnectionFlow />}
          {type === RequestType.SignPersonalMessage && <PersonalMessageFlow />}
          {(type === RequestType.SignAndSendTransaction || type === RequestType.SignTransaction) && <TransactionFlow />}
        </Container>
      </ChainProvider>
    </AlertProvider>
  );
}

export function App(): JSX.Element {
  console.log('[App] starting up');
  return (
    <RequestProvider>
      <RequestConsumer />
    </RequestProvider>
  );
}
