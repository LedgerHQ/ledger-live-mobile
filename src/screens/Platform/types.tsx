import {
  AppManifest,
  CatalogMetadata,
} from "@ledgerhq/live-common/lib/platform/types";

export type SectionBaseProps = {
  filteredManifests: AppManifest[];
  catalogMetadata: CatalogMetadata;
  handlePressApp: (manifest: AppManifest) => void;
};
