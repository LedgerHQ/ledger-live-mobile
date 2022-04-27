import React, { useState, useEffect } from 'react';
import { useAlert } from 'react-alert';
import { Panel } from '../../components/Panel';
import { ConnectionCompletePanel } from './ConnectionCompletePanel';
import { ConnectToDappPanel } from './ConnectToDappPanel';
import { SelectLedgerPanel } from './SelectLedgerPanel';
import { TokenValue } from '../../../../domain/currency/token-value';
import { useChain } from '../../hooks/chain-context';
import { DappConnectionState, useDappConnection } from '../../hooks/use-dapp-connection';

export function DappConnectionFlow(): JSX.Element {
  const [accountValue, setAccountValue] = useState<TokenValue>();
  const { tokenStore, chain } = useChain();
  const [state, account, errorMessage, approveConnection, reset] = useDappConnection();
  const alert = useAlert();

  useEffect(() => {
    if (errorMessage) {
      console.error('Caught error in dapp connection ui', errorMessage);
      alert.error(errorMessage);
    }
  }, [alert, errorMessage]);

  useEffect(() => {
    if (!account) {
      return;
    }
    const requestAndStoreAccount = async () => {
      try {
        const newAccountValue = await tokenStore.getNativeTokenValue(account);
        setAccountValue(newAccountValue);
      } catch (error) {
        console.error('Caught error in dapp connection ui', error);
        alert.error((error as Error).message);
      }
    };
    requestAndStoreAccount();
  }, [account, tokenStore, alert]);

  const handleCancel = () => {
    reset();
  };

  const handleDone = () => {
    reset();
  };

  return (
    <Panel>
      {state === DappConnectionState.WaitingForDevice && <SelectLedgerPanel chain={chain} />}
      {state === DappConnectionState.RequireApproval && account && accountValue && (
        <ConnectToDappPanel
          onCancel={handleCancel}
          onConnect={approveConnection}
          account={account}
          accountValue={accountValue}
        />
      )}
      {state === DappConnectionState.Approved && account && accountValue && (
        <ConnectionCompletePanel onDone={handleDone} account={account} accountValue={accountValue} />
      )}
    </Panel>
  );
}
