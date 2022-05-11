import { Chain } from '../../../domain/chain';
import { RequestType, SolanaMethod } from '../../../use-case/dto/dapp-request';
import { DappResponse } from '../../../use-case/dto/dapp-response';
import {
  ProcessAccountConnectionResult,
  ProcessAccountConnectionProps,
} from '../../../domain/dapp-information/dapp-connection-store';
import { requestSolanaDefaultAccount } from '../device/solana-background-device-store';
import { TokenValue } from '../../../domain/currency/token-value';
import { getNativeTokenValue } from '../chain/solana-web3-chain-store';

export async function processAccountConnection({
  request,
  dispatch,
  onResponse,
}: ProcessAccountConnectionProps): Promise<ProcessAccountConnectionResult> {
  // Check if account is in storage for this chain

  // If not, fetch from native:
  const account = await requestSolanaDefaultAccount(request);

  dispatch({ type: 'setAccount', account });

  const storeAccountAndRespond = (): void => {
    dispatch({ type: 'approveAccountForCurrentDapp' });

    // Store account in storage for this chain

    // Respond:
    const response = DappResponse.create({
      id: request.getID(),
      type: RequestType.ConnectDapp,
      method: SolanaMethod.ConnectDapp,
      payload: account,
      chain: Chain.Solana,
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
