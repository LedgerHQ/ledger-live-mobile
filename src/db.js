// @flow
import store from "react-native-simple-store";

const ACCOUNTS_KEY = "accounts";
const ACCOUNTS_DB_PREFIX = "accounts.active.";

export default class DB {
  static get(key: string | any[]): Promise<any> {
    /** handle accounts case */
    if (key === ACCOUNTS_KEY) return DB.getAccounts();
    return store.get(key);
  }

  static save(key: string | any[], value: any): Promise<any> {
    /** handle accounts case */
    if (key === ACCOUNTS_KEY) return DB.saveAccounts(value);
    return store.save(key, value);
  }

  static update(key: string, value: any): Promise<any> {
    return store.update(key, value);
  }

  static keys(): Promise<any> {
    return store.keys();
  }

  static delete(key: string | any[]): Promise<any> {
    return store.delete(key);
  }

  static push(key: string, value: any): Promise<any> {
    return store.push(key, value);
  }

  /** format account id to its account DB key */
  static formatAccountDBKey = (id: string): string =>
    `${ACCOUNTS_DB_PREFIX}${id}`;

  /** save accounts method between SQLite db and redux store persist */
  static saveAccounts({
    active: newAccounts,
  }: {
    active: any[],
  }): Promise<any> {
    return DB.getAccountsKeys().then(currentAccountKeys => {
      /** format data for DB persist */
      const dbData = newAccounts.map(({ data }) => [
        DB.formatAccountDBKey(data.id),
        { data, version: 1 },
      ]);

      /** Find current DB accounts keys diff with app state to remove them */
      const deletedKeys =
        currentAccountKeys && currentAccountKeys.length
          ? currentAccountKeys.filter(key =>
              dbData.every(([accountKey]) => accountKey !== key),
            )
          : [];

      /** persist store data to DB */
      return store.save(dbData).then(() => {
        /** then delete potential removed keys */
        if (deletedKeys.length > 0) return DB.delete(deletedKeys);

        return Promise.resolve(true);
      });
    });
  }

  /** get Db accounts keys */
  static getAccountsKeys(): Promise<Array<string>> {
    return DB.keys().then(keys => {
      /** filter through them to get only the accounts ones */
      return keys.filter(key => key.indexOf(ACCOUNTS_DB_PREFIX) === 0);
    });
  }

  /** get accounts specific method to agregate all account keys into the correct format */
  static getAccounts(): Promise<any> {
    /** fetch all DB keys */
    return DB.getAccountsKeys().then(accountKeys => {
      /** if present return them */
      if (accountKeys && accountKeys.length > 0)
        return store.get(accountKeys).then(active => ({ active }));

      /** else return empty state data */
      return Promise.resolve({ active: [] });
    });
  }

  /** migrate accounts data if necessary */
  static migrateAccounts(): Promise<any> {
    return DB.keys().then(keys => {
      /** check if old data is present */
      const hasOldAccounts = keys.includes(ACCOUNTS_KEY);
      if (hasOldAccounts) {
        /** fetch old accounts db data */
        return store.get(ACCOUNTS_KEY).then(oldAccounts => {
          /** format old data to be saved on an account based key */
          const accountsData = (oldAccounts && oldAccounts.active) || [];

          const newDBData = accountsData.map(({ data }) => [
            DB.formatAccountDBKey(data.id),
            { data, version: 1 },
          ]);
          /** save new formatted data then remove old data from DB */
          return store.save(newDBData).then(() => DB.delete(ACCOUNTS_KEY));
        });
      }

      /** no need to migrate if no old accounts data present */
      return Promise.resolve(true);
    });
  }
}
