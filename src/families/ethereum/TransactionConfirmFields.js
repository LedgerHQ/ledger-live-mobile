// @flow
import React from "react";
import type { Account } from "@ledgerhq/live-common/lib/types";
import type { Transaction } from "@ledgerhq/live-common/lib/families/ethereum/types";
import { TextValueField } from "../../components/ValidateOnDeviceDataRow";

type FieldProps = {
  account: Account,
  transaction: Transaction,
  field: {
    type: string,
    label: string,
  },
};

function EthereumDataField({ field, transaction: tx }: FieldProps) {
  return <TextValueField label={field.label} value={tx.data ? "YES" : "NO"} />;
}

const fieldComponents = {
  data: EthereumDataField,
};

export default {
  fieldComponents,
};
