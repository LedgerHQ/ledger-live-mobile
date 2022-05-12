import assert from 'assert';
import { Chain } from '../../../domain/chain';
import { DappRequest, EthereumMethod, RequestType } from '../../../use-case/dto/dapp-request';
import { DappResponse } from '../../../use-case/dto/dapp-response';
import { signPersonalMessage } from '../device/ethereum-background-device-store';
import { PersonalMessage } from '../../../domain/personal-message';
import { EthereumPersonalMessage } from '../../../domain/personal-message/ethereum';
import { ProcessPersonalMessageProps } from '../../../domain/personal-message/personal-message-store';

export function mapPersonalMessage(request: DappRequest): PersonalMessage {
  const payload = request.getPayload();
  assert(
    payload instanceof EthereumPersonalMessage,
    'request payload must be EthereumPersonalMessage to map personal message',
  );

  const personalMessage = payload.getValueAscii();
  return PersonalMessage.create(personalMessage);
}

export const processPersonalMessage = async ({
  request,
  onPersonalMessageSigned,
  onResponse,
}: ProcessPersonalMessageProps): Promise<void> => {
  const signedPersonalMessage = await signPersonalMessage(request);

  onPersonalMessageSigned();

  const response = DappResponse.create({
    id: request.getID(),
    type: RequestType.SignPersonalMessage,
    method: EthereumMethod.SignPersonalMessage,
    payload: signedPersonalMessage,
    chain: Chain.Ethereum,
  });

  onResponse(response);
};
