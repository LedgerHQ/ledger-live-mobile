import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import { slideInUp } from 'react-animations';
import { DappConnectionFlow } from './panels/dapp-connection';
import { TransactionFlow } from './panels/transaction';
import { ChainProvider } from './hooks/chain-context';
import { RequestProvider, useRequest } from './hooks/request-context';
import { RequestType } from '../../use-case/dto/dapp-request';
import { PersonalMessageFlow } from './panels/personal-message';
import { AccountProvider } from './hooks/account-context';

Sentry.init({
  dsn: 'https://61343ca99885431bb2360f3ea6ce3443@o1196144.ingest.sentry.io/6319296',
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});

const Container = styled.div<{ active?: boolean }>`
  ${(props) =>
    props.active &&
    css`
      z-index: 999999;
      position: fixed;
      background-color: rgb(0, 0, 13, 0.7);
      width: 100%;
      height: 100%;
    `}
`;

const slideInAnimation = keyframes`${slideInUp}`;

const PanelContainer = styled.div<{ active?: boolean }>`
  bottom: 0;
  position: absolute;
  width: 100%;
  height: 100%;

  ${(props) =>
    props.active &&
    css`
      animation: 0.4s ${slideInAnimation};
    `}
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

function RequestComponent(): JSX.Element | null {
  const { request } = useRequest();

  console.log('[App] request', request);

  // TODO: https://trello.com/c/NZ0B16gM/47-remember-connections-to-a-specific-dapp
  // const requiresUI = usePreprocessing(request, handleResponse);

  return (
    <Container active={!!request}>
      <PanelContainer active={!!request}>
        {(() => {
          if (!request) {
            return null;
          }

          const chain = request.getChain();
          const type = request.getType();

          console.log('[App] render', chain, type);

          return (
            <ChainProvider chain={chain}>
              {type === RequestType.ConnectDapp && <DappConnectionFlow />}
              {type === RequestType.SignPersonalMessage && <PersonalMessageFlow />}
              {(type === RequestType.SignAndSendTransaction || type === RequestType.SignTransaction) && (
                <TransactionFlow />
              )}
            </ChainProvider>
          );
        })()}
      </PanelContainer>
    </Container>
  );
}

export function App(): JSX.Element {
  console.log('[App] starting up');
  return (
    <RequestProvider>
      <AlertProvider
        template={AlertTemplate}
        position={positions.TOP_CENTER}
        offset="30px"
        transition={transitions.SCALE}
        containerStyle={{ zIndex: 1000000, textTransform: 'initial' }}
      >
        <AccountProvider>
          <RequestComponent />
        </AccountProvider>
      </AlertProvider>
    </RequestProvider>
  );
}
