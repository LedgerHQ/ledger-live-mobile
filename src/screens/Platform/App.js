import React from "react";
import { useAppManifest } from "@ledgerhq/live-common/lib/platform/CatalogProvider";

import WebPlatformPlayer from "../../components/WebPlatformPlayer";

const PlatformApp = ({ route }: { route: { params: Props } }) => {
  const platform = route.params.platform;
  const manifest = useAppManifest(platform);

  return <WebPlatformPlayer manifest={manifest} />;
};

export default PlatformApp;
