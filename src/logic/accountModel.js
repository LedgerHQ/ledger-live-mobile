// @flow
import { BigNumber } from "bignumber.js";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { createDataModel } from "@ledgerhq/live-common/lib/DataModel";
import type { DataModel } from "@ledgerhq/live-common/lib/DataModel";
import type {
  Account,
  AccountRaw,
  Operation,
} from "@ledgerhq/live-common/lib/types";

/**
 * @memberof models/account
 */
export const opRetentionStategy = (maxDaysOld: number, keepFirst: number) => (
  op: Operation,
  index: number,
): boolean =>
  index < keepFirst || Date.now() - op.date < 1000 * 60 * 60 * 24 * maxDaysOld;

const opRetentionFilter = opRetentionStategy(366, 100);

const accountModel: DataModel<AccountRaw, Account> = createDataModel({
  migrations: [],

  decode: (rawAccount: AccountRaw): Account => {
    const {
      currencyId,
      unitMagnitude,
      operations,
      pendingOperations,
      lastSyncDate,
      balance,
      ...acc
    } = rawAccount;
    const currency = getCryptoCurrencyById(currencyId);
    const unit =
      currency.units.find(u => u.magnitude === unitMagnitude) ||
      currency.units[0];
    const convertOperation = ({ date, value, fee, ...op }) => ({
      ...op,
      accountId: acc.id,
      date: new Date(date),
      value: BigNumber(value),
      fee: BigNumber(fee),
    });
    return {
      ...acc,
      balance: BigNumber(balance),
      operations: operations.map(convertOperation),
      pendingOperations: pendingOperations.map(convertOperation),
      unit,
      currency,
      lastSyncDate: new Date(lastSyncDate),
    };
  },

  encode: ({
    currency,
    operations,
    pendingOperations,
    unit,
    lastSyncDate,
    balance,
    ...acc
  }: Account): AccountRaw => {
    const convertOperation = ({ date, value, fee, ...op }) => ({
      ...op,
      date: date.toISOString(),
      value: value.toString(),
      fee: fee.toString(),
    });

    return {
      ...acc,
      operations: operations.filter(opRetentionFilter).map(convertOperation),
      pendingOperations: pendingOperations.map(convertOperation),
      currencyId: currency.id,
      unitMagnitude: unit.magnitude,
      lastSyncDate: lastSyncDate.toISOString(),
      balance: balance.toString(),
    };
  },
});

export default accountModel;
