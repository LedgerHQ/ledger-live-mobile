import assert from 'assert';
import { ValueObject } from '../../../library/ddd-core-objects';

interface DappInformationProps {
  name: string;
  hostname: string;
  iconURL: string;
}

export class DappInformation extends ValueObject<DappInformationProps> {
  public getName(): string {
    return this.props.name;
  }

  public getHostname(): string {
    return this.props.hostname;
  }

  public getIconURL(): string {
    return this.props.iconURL;
  }

  public static create(props: DappInformationProps): DappInformation {
    assert(typeof props.name === 'string', 'name must be a string');
    assert(typeof props.hostname === 'string', 'hostname must be a string');
    assert(typeof props.iconURL === 'string', 'iconURL must be a string');
    return new DappInformation(props);
  }
}
