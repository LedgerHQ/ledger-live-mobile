import React, { useEffect } from 'react';
import { useAlert } from 'react-alert';
import { Panel } from '../../components/Panel';
import { ConnectionCompletePanel } from './ConnectionCompletePanel';
import { ConnectToDappPanel } from './ConnectToDappPanel';
import { SelectLedgerPanel } from './SelectLedgerPanel';
import { useChain } from '../../hooks/chain-context';
import { AccountRequestState, useAccountRequest } from '../../hooks/account-context';

export function DappConnectionFlow(): JSX.Element {
  const { chain } = useChain();
  const {
    state,
    accountToApprove: account,
    accountValue,
    errorMessage,
    handleApproveConnection: approveConnection,
    handleReset: reset,
  } = useAccountRequest();
  const alert = useAlert();

  useEffect(() => {
    if (errorMessage) {
      console.error('Caught error in dapp connection ui', errorMessage);
      alert.error(errorMessage);
    }
  }, [alert, errorMessage]);

  const handleCancel = () => {
    reset();
  };

  const handleDone = () => {
    reset();
  };

  return (
    <Panel>
      {state === AccountRequestState.WaitingForDevice && <SelectLedgerPanel chain={chain} />}
      {state === AccountRequestState.RequireApproval && account && (
        <ConnectToDappPanel
          onCancel={handleCancel}
          onConnect={approveConnection}
          account={account}
          accountValue={accountValue}
        />
      )}
      {state === AccountRequestState.Approved && account && accountValue && (
        <ConnectionCompletePanel onDone={handleDone} account={account} accountValue={accountValue} />
      )}
    </Panel>
  );
}
