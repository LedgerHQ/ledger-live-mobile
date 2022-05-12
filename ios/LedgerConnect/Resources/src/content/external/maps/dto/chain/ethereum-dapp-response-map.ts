import assert from 'assert';
import { DappResponse } from '../../../../use-case/dto/dapp-response';
import { EthereumMethod, RequestType } from '../../../../use-case/dto/dapp-request';
import { assertArrayOfInstance, assertUnreachable } from '../../../../../library/typeguards';
import * as AccountsMap from '../../ledger/accounts-map';
import * as TransactionHashMap from '../../transaction/ethereum/transaction-hash-map';
import * as PersonalMessageSignatureMap from '../../personal-message/ethereum/personal-message-signature-map';
import { Account } from '../../../../domain/ledger/account';
import { Chain } from '../../../../domain/chain';
import { TransactionHash } from '../../../../domain/transaction/ethereum/transaction-hash';
import { PersonalMessageSignature } from '../../../../domain/personal-message/ethereum/personal-message-signature';

export type EthereumRawDappResponseDTO =
  | {
      id: number;
      type: RequestType.ConnectDapp;
      method: EthereumMethod.ConnectDapp;
      payload: string[];
      chain: Chain.Ethereum;
    }
  | {
      id: number;
      type: RequestType.SignAndSendTransaction;
      method: EthereumMethod.SignAndSendTransaction;
      payload: string | undefined;
      chain: Chain.Ethereum;
    }
  | {
      id: number;
      type: RequestType.SignPersonalMessage;
      method: EthereumMethod.SignPersonalMessage;
      payload: string;
      chain: Chain.Ethereum;
    };

export function mapDomainToDappDTO(response: DappResponse): EthereumRawDappResponseDTO {
  const method = response.getMethod();

  let value: EthereumRawDappResponseDTO;

  switch (method) {
    case EthereumMethod.ConnectDapp: {
      const accounts = response.getPayload();
      assertArrayOfInstance(accounts, Account, 'payload must be Account[] while mapping domain to dapp DTO');
      value = {
        id: response.getID(),
        type: RequestType.ConnectDapp,
        method: EthereumMethod.ConnectDapp,
        payload: AccountsMap.mapDomainToDappDTO(accounts),
        chain: Chain.Ethereum,
      };
      break;
    }
    case EthereumMethod.SignAndSendTransaction: {
      const transactionHash = response.getPayload();
      assert(
        typeof transactionHash === 'undefined' || transactionHash instanceof TransactionHash,
        'payload must be an instance of TransactionHash or undefined',
      );
      value = {
        id: response.getID(),
        type: RequestType.SignAndSendTransaction,
        method: EthereumMethod.SignAndSendTransaction,
        payload: transactionHash ? TransactionHashMap.mapDomainToDappDTO(transactionHash) : undefined,
        chain: Chain.Ethereum,
      };
      break;
    }
    case EthereumMethod.SignPersonalMessage: {
      const personalMessageSignature = response.getPayload();
      assert(
        typeof personalMessageSignature === 'undefined' || personalMessageSignature instanceof PersonalMessageSignature,
        'payload must be an instance of PersonalMessageSignature or undefined',
      );
      value = {
        id: response.getID(),
        type: RequestType.SignAndSendTransaction,
        method: EthereumMethod.SignAndSendTransaction,
        payload: personalMessageSignature
          ? PersonalMessageSignatureMap.mapDomainToDappDTO(personalMessageSignature)
          : undefined,
        chain: Chain.Ethereum,
      };
      break;
    }

    default:
      assertUnreachable(method);
  }

  return value;
}
