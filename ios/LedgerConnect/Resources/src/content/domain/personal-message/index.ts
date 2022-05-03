import { ValueObject } from '../../../library/ddd-core-objects';

interface PersonalMessageProps {
  personalMessage: string;
}

export class PersonalMessage extends ValueObject<PersonalMessageProps> {
  public getValue(): string {
    return this.props.personalMessage;
  }

  public static create(personalMessage: string): PersonalMessage {
    return new PersonalMessage({ personalMessage });
  }
}
