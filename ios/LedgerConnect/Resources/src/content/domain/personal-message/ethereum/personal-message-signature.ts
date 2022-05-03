import { ValueObject } from '../../../../library/ddd-core-objects';

interface PersonalMessageSignatureProps {
  signedPersonalMessageData: string;
}

export class PersonalMessageSignature extends ValueObject<PersonalMessageSignatureProps> {
  public getValue(): string {
    return this.props.signedPersonalMessageData;
  }

  public static create(signedPersonalMessageData: string): PersonalMessageSignature {
    return new PersonalMessageSignature({ signedPersonalMessageData });
  }
}
