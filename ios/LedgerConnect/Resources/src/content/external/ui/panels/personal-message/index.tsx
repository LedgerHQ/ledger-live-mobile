import React, { useEffect } from 'react';
import { useAlert } from 'react-alert';
import { Panel } from '../../components/Panel';
import { PersonalMessageState, usePersonalMessage } from '../../hooks/use-personal-message';
import { InitiatePersonalMessagePanel } from './InitiatePersonalMessagePanel';
import { ReviewPersonalMessagePanel } from './ReviewPersonalMessagePanel';

export function PersonalMessageFlow(): JSX.Element {
  const [state, personalMessage, errorMessage, handleContinue, reset] = usePersonalMessage();
  const alert = useAlert();

  useEffect(() => {
    if (errorMessage) {
      console.error('Caught error in personal message ui', errorMessage);
      alert.error(errorMessage);
    }
  }, [alert, errorMessage]);

  const handleCancel = () => {
    reset();
  };

  return (
    <Panel>
      {state === PersonalMessageState.Initiated && (
        <InitiatePersonalMessagePanel
          personalMessage={personalMessage}
          onCancel={handleCancel}
          onContinue={handleContinue}
        />
      )}
      {state === PersonalMessageState.WaitingForConfirmation && (
        <ReviewPersonalMessagePanel personalMessage={personalMessage} onCancel={handleCancel} />
      )}
    </Panel>
  );
}
