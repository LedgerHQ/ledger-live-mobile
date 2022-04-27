import { Chain } from '../../../domain/chain';
import { DappRequest, RequestType, SolanaMethod } from '../../../use-case/dto/dapp-request';
import { DappResponse } from '../../../use-case/dto/dapp-response';
import {
  OnResponseFunction,
  RequestDefaultAccountResponse,
} from '../../../domain/dapp-information/dapp-connection-store';
import { requestSolanaDefaultAccount } from '../device/solana-background-device-store';

export async function requestDefaultAccount(request: DappRequest): Promise<RequestDefaultAccountResponse> {
  const account = await requestSolanaDefaultAccount(request);

  const storeAccountAndRespond = (onResponse: OnResponseFunction): void => {
    const response = DappResponse.create({
      id: request.getID(),
      type: RequestType.ConnectDapp,
      method: SolanaMethod.ConnectDapp,
      payload: account,
      chain: Chain.Solana,
    });
    onResponse(response);
  };

  return { account, storeAccountAndRespond };
}
