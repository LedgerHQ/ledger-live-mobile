import assert from 'assert';
import { isObjectLike } from '../../../../../library/typeguards';
import { Signature } from '../../../../domain/transaction/solana/signature';

export type SignatureNativeDTO = {
  id: number;
  value: string;
};

export interface SignatureDappDTO {
  signature: string;
}

export function mapNativeDTOToDomain(dto: unknown): Signature {
  assert(isObjectLike<SignatureNativeDTO>(dto), `The signature native dto must be an object. Got ${dto}`);
  assert(typeof dto.value === 'string', 'signature data must be a string');
  return Signature.create(dto.value);
}

export function mapWeb3DTOToDomain(dto: unknown): Signature {
  assert(typeof dto === 'string', 'signature data must be a string');
  return Signature.create(dto);
}

export function mapDomainToDappDTO(signature: Signature): SignatureDappDTO {
  return {
    signature: signature.getSignatureBase58(),
  };
}
