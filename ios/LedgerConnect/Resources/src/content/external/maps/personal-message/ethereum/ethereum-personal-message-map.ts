import assert from 'assert';
import { isObjectLike } from '../../../../../library/typeguards';
import { EthereumPersonalMessage } from '../../../../domain/personal-message/ethereum';

export interface EthereumPersonalMessageDappDTO {
  data: string;
}

export function mapDappDTOToDomain(dto: unknown): EthereumPersonalMessage {
  assert(isObjectLike<EthereumPersonalMessageDappDTO>(dto), 'the ethereum personal message dto must be an object');
  assert(typeof dto.data === 'string', 'data must be a string');
  return EthereumPersonalMessage.create(dto.data);
}

export function mapDomainToNativeDTO(request: EthereumPersonalMessage): EthereumPersonalMessageDappDTO {
  return {
    data: request.getValueHex(),
  };
}
