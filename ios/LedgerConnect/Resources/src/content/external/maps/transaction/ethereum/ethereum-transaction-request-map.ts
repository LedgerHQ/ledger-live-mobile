import assert from 'assert';
import { isObjectLike } from '../../../../../library/typeguards';
import { TokenValue } from '../../../../domain/currency/token-value';
import { EthereumTransactionRequest } from '../../../../domain/transaction/ethereum/ethereum-transaction-request';

export interface EthereumTransactionRequestDappDTO {
  data: string;
  from: string;
  gas: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  to: string;
  value: string;
  nonce: string;
  gasLimit: string;
}

interface EthereumTransactionRequestNativeDTO {
  data: string;
  from: string;
  gas: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  to: string;
  value: string;
  nonce: string;
  gasLimit: string;
}

export function mapDappDTOToDomain(dto: unknown): EthereumTransactionRequest {
  assert(
    isObjectLike<EthereumTransactionRequestDappDTO>(dto),
    'the ethereum transaction request dto must be an object',
  );
  assert(typeof dto.data === 'string', 'data must be a string');
  assert(typeof dto.from === 'string', 'from must be a string');
  assert(typeof dto.gas === 'string', 'gas must be a string');
  assert(typeof dto.maxFeePerGas === 'string', 'maxFeePerGas must be a string');
  assert(typeof dto.maxPriorityFeePerGas === 'string', 'maxPriorityFeePerGas must be a string');
  assert(typeof dto.to === 'string', 'to must be a string');
  assert(typeof dto.value === 'string', 'value must be a string');
  assert(typeof dto.nonce === 'string', 'nonce must be a string');
  assert(typeof dto.gasLimit === 'string', 'gasLimit must be a string');
  return EthereumTransactionRequest.create({
    data: dto.data,
    from: dto.from,
    gas: dto.gas,
    maxFeePerGas: dto.maxFeePerGas,
    maxPriorityFeePerGas: dto.maxPriorityFeePerGas,
    to: dto.to,
    // TODO: Fix for non-ETH tokens
    value: TokenValue.create({ valueHex: dto.value, decimals: 18, symbol: 'ETH' }),
    nonce: dto.nonce,
    gasLimit: dto.gasLimit,
  });
}

export function mapDomainToNativeDTO(request: EthereumTransactionRequest): EthereumTransactionRequestNativeDTO {
  const tokenValue = request.getValue();
  return {
    data: request.getData(),
    from: request.getFrom(),
    gas: request.getGas(),
    maxFeePerGas: request.getMaxFeePerGas(),
    maxPriorityFeePerGas: request.getMaxPriorityFeePerGas(),
    to: request.getTo(),
    value: tokenValue.getValueHex(),
    nonce: request.getNonce(),
    gasLimit: request.getGasLimit(),
  };
}
