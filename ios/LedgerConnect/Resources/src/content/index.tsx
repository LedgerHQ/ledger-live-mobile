import React from 'react';
import ReactDOM from 'react-dom';
import { getLogger } from '../logging';
import { App } from './external/ui/App';

const log = getLogger('content');

const injectUIRoot = () => {
  const font = document.createElement('link');
  font.setAttribute('href', 'https://fonts.googleapis.com/css?family=Inter');
  font.setAttribute('rel', 'stylesheet');
  document.head.appendChild(font);

  const root = document.createElement('div');
  root.id = 'ledger-connect-root';
  document.body.insertBefore(root, document.body.firstChild);

  ReactDOM.render(<App />, root);
};

const injectDappWalletConnection = (chain: string) => {
  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('async', 'false');
  script.setAttribute('src', browser.runtime.getURL(`dist/wallet-connection/${chain}/index.js`));
  document.body.insertBefore(script, document.body.firstChild);
};

const start = () => {
  injectUIRoot();
  injectDappWalletConnection('ethereum');
  injectDappWalletConnection('solana');
};

start();

log('loaded');
