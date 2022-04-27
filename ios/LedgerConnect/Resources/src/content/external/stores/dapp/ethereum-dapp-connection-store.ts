import { Chain } from '../../../domain/chain';
import { DappRequest, EthereumMethod, RequestType } from '../../../use-case/dto/dapp-request';
import { DappResponse } from '../../../use-case/dto/dapp-response';
import {
  OnResponseFunction,
  RequestDefaultAccountResponse,
} from '../../../domain/dapp-information/dapp-connection-store';
import { requestEthereumDefaultAccount } from '../device/ethereum-background-device-store';

export async function requestDefaultAccount(request: DappRequest): Promise<RequestDefaultAccountResponse> {
  const account = await requestEthereumDefaultAccount(request);

  const storeAccountAndRespond = (onResponse: OnResponseFunction): void => {
    const response = DappResponse.create({
      id: request.getID(),
      type: RequestType.ConnectDapp,
      method: EthereumMethod.ConnectDapp,
      payload: [account],
      chain: Chain.Ethereum,
    });
    onResponse(response);
  };

  return { account, storeAccountAndRespond };
}
