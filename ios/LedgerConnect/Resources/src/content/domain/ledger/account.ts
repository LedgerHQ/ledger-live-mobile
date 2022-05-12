import assert from 'assert';
import { ValueObject } from '../../../library/ddd-core-objects';

interface AccountProps {
  account: string;
}

export class Account extends ValueObject<AccountProps> {
  public getValue(): string {
    return this.props.account;
  }

  /**
   * Returns a concatenated version of the account, placing elipses in the middle of the string.
   * @param charactersToDisplay The number of total characters of the account to display.
   */
  public getConcatenated(charactersToDisplay = 8): string {
    const { account } = this.props;
    const startCharacterCount = Math.floor(charactersToDisplay / 2);
    const endCharacterCount = Math.ceil(charactersToDisplay / 2);
    return `${account.substring(0, startCharacterCount)}...${account.substring(account.length - endCharacterCount)}`;
  }

  public static create(account: string): Account {
    assert(typeof account === 'string', 'account must be a string');
    return new Account({ account });
  }
}
