// @flow

import React, { useState } from "react";
import type {
  Account,
  AccountLike,
} from "@ledgerhq/live-common/lib/types/account";
import Providers from "./Providers";
import FormOrHistory from "./FormOrHistory";

type RouteParams = {
  defaultAccount: ?AccountLike,
  defaultParentAccount: ?Account,
};

const Swap = ({ route }: { route: { params: RouteParams } }) => {
  const [provider, setProvider] = useState();
  // TODO plug in the KYC / Paraswap cases.
  // Maybe navigate if we need to go back
  return !provider ? (
    <Providers onContinue={setProvider} />
  ) : (
    <FormOrHistory {...route?.params} />
  );
};

export default Swap;
