import assert from 'assert';
import { Chain } from '../../../domain/chain';
import { Transaction } from '../../../domain/transaction';
import { DappRequest, EthereumMethod, RequestType } from '../../../use-case/dto/dapp-request';
import { DappResponse } from '../../../use-case/dto/dapp-response';
import { EthereumTransactionRequest } from '../../../domain/transaction/ethereum/ethereum-transaction-request';
import { ProcessTransactionProps } from '../../../domain/transaction/transaction-store';
import { signTransaction } from '../device/ethereum-background-device-store';
import { sendTransaction } from '../chain/ethereum-alchemy-chain-store';

export function mapTransaction(request: DappRequest): Transaction {
  const payload = request.getPayload();
  assert(
    payload instanceof EthereumTransactionRequest,
    'request payload must be EthereumTransactionRequest to map transaction',
  );

  return Transaction.create({
    from: payload.getFrom(),
    to: payload.getTo(),
    value: payload.getValue(),
  });
}

export const processTransaction = async ({
  request,
  onTransactionSigned,
  onResponse,
}: ProcessTransactionProps): Promise<void> => {
  const signedTransaction = await signTransaction(request);

  onTransactionSigned();

  const transactionHash = await sendTransaction(signedTransaction);

  const response = DappResponse.create({
    id: request.getID(),
    type: RequestType.SignAndSendTransaction,
    method: EthereumMethod.SignAndSendTransaction,
    payload: transactionHash,
    chain: Chain.Ethereum,
  });

  onResponse(response);
};
