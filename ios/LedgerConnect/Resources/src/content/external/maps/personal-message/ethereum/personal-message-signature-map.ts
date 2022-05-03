import assert from 'assert';
import { isObjectLike } from '../../../../../library/typeguards';
import { PersonalMessageSignature } from '../../../../domain/personal-message/ethereum/personal-message-signature';

export interface PersonalMessageSignatureNativeDTO {
  id: number;
  value: string;
}

export function mapNativeDTOToDomain(dto: unknown): PersonalMessageSignature {
  assert(
    isObjectLike<PersonalMessageSignatureNativeDTO>(dto),
    'the native personal messsage signature dto must be an object',
  );
  assert(typeof dto.value === 'string', 'personal messsage signature value must be a string');
  return PersonalMessageSignature.create(dto.value);
}

export function mapDomainToDappDTO(signature: PersonalMessageSignature): string {
  return signature.getValue();
}
