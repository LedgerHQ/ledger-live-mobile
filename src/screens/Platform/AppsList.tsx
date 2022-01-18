import React, { useMemo } from "react";
import { Flex } from "@ledgerhq/native-ui";
import { keyBy } from "lodash";
import { BaseSectionProps } from "./types";
import AppRow from "./AppRow";
import Divider from "./Divider";

const AppsList = ({
  filteredManifests,
  catalogMetadata,
  handlePressCard,
}: BaseSectionProps) => {
  const { appsMetadata = [] } = catalogMetadata;
  const appsMetadataMappedById = useMemo(() => keyBy(appsMetadata, "id"), [
    appsMetadata,
  ]);
  return (
    <Flex flexDirection="column">
      {filteredManifests.map((manifest, index, arr) => {
        const appMetadata = appsMetadataMappedById[manifest.id];
        return (
          <React.Fragment key={manifest.id}>
            <AppRow
              manifest={manifest}
              appMetadata={appMetadata}
              onPress={handlePressCard}
            />
            {index !== arr.length - 1 && <Divider />}
          </React.Fragment>
        );
      })}
    </Flex>
  );
};

export default AppsList;
