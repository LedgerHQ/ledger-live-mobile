// @flow

import React, { useState } from "react";
import type {
  Account,
  AccountLike,
} from "@ledgerhq/live-common/lib/types/account";
import Providers from "./Providers";
import FormOrHistory from "./FormOrHistory";
import WebPlatformPlayer from "../../components/WebPlatformPlayer";
import manifests from "./Providers/manifests";

type RouteParams = {
  defaultAccount: ?AccountLike,
  defaultParentAccount: ?Account,
};

const renderProvider = (params: RouteParams, provider: string) => {
  // TODO: may need something more robust against unknown/unsupported providers
  switch (provider) {
    case "changelly":
      return <FormOrHistory {...params} />;
    default: {
      const manifest = manifests[provider];
      return manifest ? <WebPlatformPlayer manifest={manifest} /> : null;
    }
  }
};

const Swap = ({ route }: { route: { params: RouteParams } }) => {
  const [provider, setProvider] = useState();

  // TODO: plug in the KYC case.
  // Maybe navigate if we need to go back
  return !provider ? (
    <Providers onContinue={setProvider} />
  ) : (
    renderProvider(route?.params, provider)
  );
};

export default Swap;
