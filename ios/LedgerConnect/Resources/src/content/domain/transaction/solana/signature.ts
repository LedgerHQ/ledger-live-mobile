import { base58_to_binary as base58ToBinary } from 'base58-js';
import { ValueObject } from '../../../../library/ddd-core-objects';

interface SignatureProps {
  signatureBase58: string;
}

export class Signature extends ValueObject<SignatureProps> {
  public getSignatureBase58(): string {
    return this.props.signatureBase58;
  }

  public getSignatureBuffer(): Buffer {
    const binary = base58ToBinary(this.props.signatureBase58);
    return Buffer.from(binary);
  }

  public static create(signatureBase58: string): Signature {
    return new Signature({ signatureBase58 });
  }
}
