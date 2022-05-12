import { Chain } from '../../../domain/chain';
import { EthereumMethod, RequestType } from '../../../use-case/dto/dapp-request';
import { DappResponse } from '../../../use-case/dto/dapp-response';
import {
  ProcessAccountConnectionProps,
  ProcessAccountConnectionResult,
} from '../../../domain/dapp-information/dapp-connection-store';
import { requestEthereumDefaultAccount } from '../device/ethereum-background-device-store';
import { TokenValue } from '../../../domain/currency/token-value';
import { getNativeTokenValue } from '../chain/ethereum-alchemy-chain-store';

export async function processAccountConnection({
  request,
  dispatch,
  onResponse,
}: ProcessAccountConnectionProps): Promise<ProcessAccountConnectionResult> {
  // Check if account is in storage for this chain

  // If not, fetch from native:
  const account = await requestEthereumDefaultAccount(request);

  dispatch({ type: 'setAccount', account });

  const storeAccountAndRespond = (): void => {
    dispatch({ type: 'approveAccountForCurrentDapp' });

    // Store account in storage for this chain

    // Respond:
    const response = DappResponse.create({
      id: request.getID(),
      type: RequestType.ConnectDapp,
      method: EthereumMethod.ConnectDapp,
      payload: [account],
      chain: Chain.Ethereum,
    });
    onResponse(response);
  };

  const getAccountValue = (): Promise<TokenValue> => {
    return getNativeTokenValue(account);
  };

  return {
    handleApproveAccount: storeAccountAndRespond,
    accountToApprove: account,
    getAccountValue,
  };
}
