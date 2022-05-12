import { PersonalMessage } from '.';
import { DappRequest } from '../../use-case/dto/dapp-request';
import { DappResponse } from '../../use-case/dto/dapp-response';

export interface ProcessPersonalMessageProps {
  request: DappRequest;
  onPersonalMessageSigned: () => void;
  onResponse: (response: DappResponse) => void;
}

export interface PersonalMessageStore {
  mapPersonalMessage(request: DappRequest): PersonalMessage;
  processPersonalMessage(props: ProcessPersonalMessageProps): Promise<void>;
}
