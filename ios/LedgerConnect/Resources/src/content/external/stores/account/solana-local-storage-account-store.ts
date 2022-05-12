import { Chain } from '../../../domain/chain';
import { Account } from '../../../domain/ledger/account';
import { AccountStore } from '../../../domain/ledger/account-store';

// TODO: https://trello.com/c/NZ0B16gM/47-remember-connections-to-a-specific-dapp

export class SolanaLocalStorageAccountStore implements AccountStore {
  public storeAccount(account: Account, chain: Chain): void {
    console.log('[solana-local-storage-account-store] store account', account, chain);
  }

  public getAccount(chain: Chain): Account | undefined {
    console.log('[solana-local-storage-account-store] get account', chain);
    return undefined;
  }
}
