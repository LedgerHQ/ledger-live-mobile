import React, { useEffect } from 'react';
import { useAlert } from 'react-alert';
import { Panel } from '../../components/Panel';
import { InitiateTransactionPanel } from './InitiateTransactionPanel';
import { ReviewTransactionPanel } from './ReviewTransactionPanel';
import { TransactionInProgressPanel } from './TransactionInProgressPanel';
import { TransactionCompletePanel } from './TransactionCompletePanel';
import { TransactionState, useTransaction } from '../../hooks/use-transaction';

export function TransactionFlow(): JSX.Element {
  const [state, transaction, errorMessage, handleContinue, reset, networkInfo] = useTransaction();
  const alert = useAlert();

  useEffect(() => {
    if (errorMessage) {
      console.error('Caught error in transaction ui', errorMessage);
      alert.error(errorMessage);
    }
  }, [alert, errorMessage]);

  const handleCancel = () => {
    reset();
  };

  const handleDone = () => {
    reset();
  };

  const transactionValue = transaction.getValue();

  return (
    <Panel>
      {state === TransactionState.Initiated && (
        <InitiateTransactionPanel
          transactionValue={transactionValue}
          onCancel={handleCancel}
          onContinue={handleContinue}
          networkInformation={networkInfo}
        />
      )}
      {state === TransactionState.WaitingForConfirmation && (
        <ReviewTransactionPanel
          transactionValue={transactionValue}
          onCancel={handleCancel}
          from={transaction.getFrom()}
          to={transaction.getTo()}
          networkInformation={networkInfo}
        />
      )}
      {state === TransactionState.TransactionInProgress && <TransactionInProgressPanel />}
      {state === TransactionState.Complete && (
        <TransactionCompletePanel transactionValue={transactionValue} onDone={handleDone} />
      )}
    </Panel>
  );
}
