// @flow

import invariant from "invariant";
import React from "react";
import { DeviceTransactionField } from "@ledgerhq/live-common/lib/transaction";

import LText from "../../components/LText";
import { DataRow } from "../../components/ValidateOnDeviceDataRow";

const addressStyle = {
  wordBreak: "break-all",
  textAlign: "right",
  maxWidth: "70%",
};

const FilecoinField = ({ transaction, field }: { transaction: Transaction, field: DeviceTransactionField }) => {
  invariant(transaction.family === "filecoin", "filecoin transaction");

  return (
    <DataRow label={field.label}>
      <LText style={addressStyle} ml={1} ff="Inter|Medium" color="palette.text.shade80" fontSize={3}>
        {field.value}
      </LText>
    </DataRow>
  );
};

const fieldComponents = {
  "filecoin.gasFeeCap": FilecoinField,
  "filecoin.gasPremium": FilecoinField,
  "filecoin.gasLimit": FilecoinField,
  "filecoin.method": FilecoinField,
};

export default {
  fieldComponents,
};
