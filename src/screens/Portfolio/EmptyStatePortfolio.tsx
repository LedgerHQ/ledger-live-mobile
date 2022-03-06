/* @flow */
import React, { memo, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Trans } from "react-i18next";
import { Image } from "react-native";
import { Box, Flex, Text } from "@ledgerhq/native-ui";
import { hasInstalledAnyAppSelector } from "../../reducers/settings";
import { ScreenName } from "../../const";
import Button from "../../components/Button";
import AddAccountsModal from "../AddAccounts/AddAccountsModal";
import noAccountsImg from "../../images/noAccounts.png";
import noAppsImg from "../../images/noApps.png";
import HelpLink from "../../components/HelpLink";
import { urls } from "../../config/urls";

type Props = {
  navigation: any;
  showHelp?: boolean;
};

function EmptyStatePortfolio({ navigation, showHelp = true }: Props) {
  const hasInstalledAnyApp = useSelector(hasInstalledAnyAppSelector);
  const [isAddModalOpened, setAddModalOpened] = useState(false);

  const openAddModal = useCallback(() => setAddModalOpened(true), [
    setAddModalOpened,
  ]);

  const closeAddModal = useCallback(() => setAddModalOpened(false), [
    setAddModalOpened,
  ]);

  const navigateToManager = useCallback(
    () => navigation.navigate(ScreenName.Manager),
    [navigation],
  );

  return (
    <>
      {showHelp ? (
        <Flex alignSelf="flex-end" mx={6}>
          <HelpLink
            url={hasInstalledAnyApp ? urls.addAccount : urls.goToManager}
            color="grey"
          />
        </Flex>
      ) : null}
      <Flex m={6} flex={1} flexDirection="column" justifyContent="center">
        <Box alignItems="center" mt={8}>
          <Image source={hasInstalledAnyApp ? noAccountsImg : noAppsImg} />
          <Text variant="body" fontWeight="bold" mt={9} mb={4}>
            <Trans
              i18nKey={`portfolio.emptyState.${
                hasInstalledAnyApp ? "noAccountsTitle" : "noAppsTitle"
              }`}
            />
          </Text>
          <Text variant="body" mb={8} textAlign="center" color="neutral.c30">
            <Trans
              i18nKey={`portfolio.emptyState.${
                hasInstalledAnyApp ? "noAccountsDesc" : "noAppsDesc"
              }`}
            />
          </Text>

          <Flex alignSelf="stretch" flexDirection="column">
            {hasInstalledAnyApp ? (
              <>
                <Button
                  event="PortfolioEmptyToImport"
                  type={"primary"}
                  title={
                    <Trans i18nKey="portfolio.emptyState.buttons.import" />
                  }
                  onPress={openAddModal}
                  containerStyle={{ marginBottom: 16 }}
                />
                <Button
                  event="PortfolioEmptyToManager"
                  type={"lightSecondary"}
                  title={
                    <Trans i18nKey="portfolio.emptyState.buttons.managerSecondary" />
                  }
                  onPress={navigateToManager}
                />
              </>
            ) : (
              <Button
                event="PortfolioEmptyToManager"
                type={"primary"}
                title={<Trans i18nKey="portfolio.emptyState.buttons.manager" />}
                onPress={navigateToManager}
              />
            )}
          </Flex>
          <AddAccountsModal
            navigation={navigation}
            isOpened={isAddModalOpened}
            onClose={closeAddModal}
          />
        </Box>
      </Flex>
    </>
  );
}

export default memo<Props>(EmptyStatePortfolio);
