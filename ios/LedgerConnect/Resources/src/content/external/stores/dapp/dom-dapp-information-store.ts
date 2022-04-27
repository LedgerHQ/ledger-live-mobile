import { DappInformation } from '../../../domain/dapp-information';
import { DappInformationStore } from '../../../domain/dapp-information/dapp-information-store';

export class DOMDappInformationStore implements DappInformationStore {
  private getName(): string {
    const { hostname } = window.location;
    const parts = hostname.split('.');
    return parts.length >= 2 ? parts[parts.length - 2] : '';
  }

  private getHostname(): string {
    return window.location.hostname;
  }

  private getIconURL(): string {
    const { origin } = window.location;
    return `https://www.google.com/s2/favicons?sz=64&domain_url=${origin}`;
  }

  public getDappInformation(): DappInformation {
    return DappInformation.create({
      name: this.getName(),
      hostname: this.getHostname(),
      iconURL: this.getIconURL(),
    });
  }
}
