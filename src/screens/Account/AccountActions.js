/* @flow */
import React, { useCallback, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { AccountLike, Account } from "@ledgerhq/live-common/lib/types";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import { useLocale } from "../../context/Locale";
import {
  getAccountCurrency,
  getAccountUnit,
  getMainAccount,
} from "@ledgerhq/live-common/lib/account";
import { useSelector } from "react-redux";
import { Trans } from "react-i18next";
import { getAccountCapabilities } from "@ledgerhq/live-common/lib/compound/logic";
import { NavigatorName, ScreenName } from "../../const";
import {
  readOnlyModeEnabledSelector,
  swapSupportedCurrenciesSelector,
} from "../../reducers/settings";
import {
  ReceiveActionDefault,
  SendActionDefault,
} from "./AccountActionsDefault";
import perFamilyAccountActions from "../../generated/accountActions";

import { isCurrencySupported } from "../Exchange/coinifyConfig";
import BottomModal from "../../components/BottomModal";
import LText from "../../components/LText";
import Touchable from "../../components/Touchable";
import colors from "../../colors";
import Button from "../../components/Button";
import InfoBox from "../../components/InfoBox";
import WarningBox from "../../components/WarningBox";
import Transfer from "../../icons/Transfer";
import Swap from "../../icons/Swap";
import Lending from "../../icons/Lending";
import Plus from "../../icons/Plus";
import Supply from "../../icons/Supply";
import Withdraw from "../../icons/Withdraw";
import Exchange from "../../icons/Exchange";
import BigNumber from "bignumber.js";

type ChoiceButtonProps = {
  disabled: boolean,
  onNavigate: () => void,
  label: React$Node,
  description: React$Node,
  Icon: any,
  extra?: React$Node,
  event?: string,
  eventProperties: *,
  navigationParams: [*],
};

const ChoiceButton = ({
  event,
  eventProperties,
  disabled,
  label,
  description,
  Icon,
  extra,
  onNavigate,
  navigationParams,
}: ChoiceButtonProps) => (
  <Touchable
    event={event}
    eventProperties={eventProperties}
    style={styles.button}
    disabled={disabled}
    onPress={() => onNavigate(...(navigationParams || []))}
  >
    <View
      style={[
        styles.buttonIcon,
        disabled ? { backgroundColor: colors.lightFog } : {},
      ]}
    >
      <Icon color={disabled ? colors.grey : colors.live} size={18} />
    </View>

    <View style={styles.buttonLabelContainer}>
      <LText
        style={[styles.buttonLabel, disabled ? styles.disabledButton : {}]}
        semiBold
      >
        {label}
      </LText>
      {description && <LText style={[styles.buttonDesc]}>{description}</LText>}
    </View>
    {extra && <View style={styles.extraButton}>{extra}</View>}
  </Touchable>
);

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
};

type NavOptions = {
  screen: string,
  params?: { [key: string]: any },
};

export default function AccountActions({ account, parentAccount }: Props) {
  const [modalOpen, setModalOpen] = useState();
  const [displayLendingActions, setDisplayLendingActions] = useState(false);
  const navigation = useNavigation();
  const { locale } = useLocale();
  const readOnlyModeEnabled = useSelector(readOnlyModeEnabledSelector);
  const availableOnSwap = useSelector(state =>
    swapSupportedCurrenciesSelector(state, { accountId: account.id }),
  );
  const mainAccount = getMainAccount(account, parentAccount);
  const decorators = perFamilyAccountActions[mainAccount.currency.family];
  const currency = getAccountCurrency(account);
  const unit = getAccountUnit(account);

  const accountId = account.id;
  const parentId = parentAccount && parentAccount.id;

  const availableOnCompound =
    account.type === "TokenAccount" && !!account.compoundBalance;
  const compoundCapabilities = availableOnCompound
    ? getAccountCapabilities(account)
    : {};

  let lendingInfoBanner = null;

  if (availableOnCompound) {
    const lendingInfoBannerContent = !compoundCapabilities.status ? (
      <Trans i18nKey="transfer.lending.banners.needApproval" />
    ) : compoundCapabilities.enabledAmountIsUnlimited ? (
      <Trans i18nKey="transfer.lending.banners.fullyApproved" />
    ) : !!compoundCapabilities.status &&
      compoundCapabilities.enabledAmount.gt(0) &&
      compoundCapabilities.canSupplyMax ? (
      <Trans
        i18nKey="transfer.lending.banners.approvedCanReduce"
        values={{
          value: formatCurrencyUnit(unit, compoundCapabilities.enabledAmount, {
            locale,
            showAllDigits: false,
            disableRounding: true,
            showCode: true,
          }),
        }}
      >
        <LText semiBold />
      </Trans>
    ) : compoundCapabilities.enabledAmount.gt(0) ? (
      <Trans
        i18nKey="transfer.lending.banners.approvedButNotEnough"
        values={{
          value: formatCurrencyUnit(unit, compoundCapabilities.enabledAmount, {
            locale,
            showAllDigits: false,
            disableRounding: true,
            showCode: true,
          }),
        }}
      >
        <LText semiBold />
      </Trans>
    ) : null;

    if (lendingInfoBannerContent) {
      lendingInfoBanner = (
        <View style={styles.bannerBox}>
          <InfoBox>{lendingInfoBannerContent}</InfoBox>
        </View>
      );
    }
  }

  let lendingWarningBanner = null;

  if (availableOnCompound) {
    const lendingWarningBannerContent =
      compoundCapabilities.status === "ENABLING" ? (
        <Trans i18nKey="transfer.lending.banners.approving" />
      ) : !!compoundCapabilities.status &&
        !compoundCapabilities.canSupplyMax ? (
        <Trans i18nKey="transfer.lending.banners.notEnough" />
      ) : null;

    if (lendingWarningBannerContent) {
      lendingWarningBanner = (
        <View style={styles.bannerBox}>
          <WarningBox>{lendingWarningBannerContent}</WarningBox>
        </View>
      );
    }
  }

  const SendAction = (decorators && decorators.SendAction) || SendActionDefault;

  const ReceiveAction =
    (decorators && decorators.ReceiveAction) || ReceiveActionDefault;

  const openModal = useCallback(() => setModalOpen(true), [setModalOpen]);
  const closeModal = useCallback(() => {
    setModalOpen(false);
    setDisplayLendingActions(false);
  }, [setModalOpen, setDisplayLendingActions]);

  const onNavigate = useCallback(
    (name: string, options?: NavOptions) => {
      closeModal();
      navigation.navigate(name, {
        ...options,
        params: {
          accountId,
          parentId,
          ...(options ? options.params : {}),
        },
      });
    },
    [accountId, navigation, parentId, closeModal],
  );

  const canBeBought = isCurrencySupported(currency);

  const baseActions =
    (decorators &&
      decorators.getActions &&
      decorators.getActions({
        account,
        parentAccount,
      })) ||
    [];

  const actions = [
    ...baseActions,
    ...(!readOnlyModeEnabled && canBeBought
      ? [
          {
            navigationParams: [NavigatorName.Exchange, { accountId }],
            label: <Trans i18nKey="account.buy" />,
            Icon: Exchange,
            event: "Buy Crypto Account Button",
            eventProperties: {
              currencyName: currency.name,
            },
          },
        ]
      : []),
    // Add in sell and more feature flagging logic here
    ...(availableOnSwap.includes(currency)
      ? [
          {
            navigationParams: [
              NavigatorName.Swap,
              {
                screen: ScreenName.SwapFormOrHistory,
                params: {
                  defaultAccount: account,
                  defaultParentAccount: parentAccount,
                },
              },
            ],
            label: (
              <Trans
                i18nKey="transfer.swap.main.header"
                values={{ currency: currency.name }}
              />
            ),
            Icon: Swap,
            event: "Swap Crypto Account Button",
            eventProperties: { currencyName: currency.name },
          },
        ]
      : []),
    ...(availableOnCompound
      ? [
          {
            onNavigate: () => {
              setDisplayLendingActions(true);
            },
            label: (
              <Trans
                i18nKey="transfer.lending.actionTitle"
                values={{ currency: currency.name }}
              />
            ),
            Icon: Lending,
            event: "Lend Crypto Account Button",
            eventProperties: { currencyName: currency.name },
          },
        ]
      : []),
  ];

  const lendingActions = !availableOnCompound
    ? []
    : [
        {
          navigationParams: [
            NavigatorName.LendingEnableFlow,
            {
              screen: ScreenName.LendingEnableAmount,
              params: {
                accountId: account.id,
                parentId: account.parentId,
                currency,
              },
            },
          ],
          label: (
            <Trans
              i18nKey="transfer.lending.accountActions.approve"
              values={{ currency: currency.name }}
            />
          ),
          Icon: Plus,
          event: "Approve Crypto Account Button",
          eventProperties: { currencyName: currency.name },
        },
        {
          navigationParams: [
            NavigatorName.Lending,
            {
              screen: ScreenName.LendingDashboard,
            },
          ],
          label: (
            <Trans
              i18nKey="transfer.lending.accountActions.supply"
              values={{ currency: currency.name }}
            />
          ),
          Icon: Supply,
          event: "Supply Crypto Account Button",
          eventProperties: { currencyName: currency.name },
          disabled: !compoundCapabilities.canSupply,
        },
        {
          navigationParams: [
            NavigatorName.Lending,
            {
              screen: ScreenName.LendingDashboard,
            },
          ],
          label: (
            <Trans
              i18nKey="transfer.lending.accountActions.withdraw"
              values={{ currency: currency.name }}
            />
          ),
          Icon: Withdraw,
          event: "Withdraw Crypto Account Button",
          eventProperties: { currencyName: currency.name },
          disabled: !compoundCapabilities.canWithdraw,
        },
      ];

  const onSend = useCallback(() => {
    onNavigate(NavigatorName.SendFunds, {
      screen: ScreenName.SendSelectRecipient,
    });
  }, [onNavigate]);

  const onReceive = useCallback(() => {
    onNavigate(NavigatorName.ReceiveFunds, {
      screen: ScreenName.ReceiveConnectDevice,
    });
  }, [onNavigate]);

  return (
    <View style={styles.root}>
      {!readOnlyModeEnabled && (
        <SendAction
          account={account}
          parentAccount={parentAccount}
          style={[styles.btn]}
          onPress={onSend}
        />
      )}
      <ReceiveAction
        account={account}
        parentAccount={parentAccount}
        style={[styles.btn]}
        onPress={onReceive}
      />
      {actions && actions.length > 0 && (
        <>
          <Button
            event="AccountSend"
            type="primary"
            IconLeft={Transfer}
            onPress={openModal}
            title={null}
            containerStyle={styles.actionBtn}
          />
          <BottomModal
            isOpened={!!modalOpen}
            onClose={closeModal}
            containerStyle={styles.modal}
          >
            {displayLendingActions && (lendingInfoBanner || null)}
            {displayLendingActions && (lendingWarningBanner || null)}
            {(displayLendingActions ? lendingActions : actions).map((a, i) => (
              <ChoiceButton
                key={i}
                onNavigate={a.onNavigate || onNavigate}
                {...a}
              />
            ))}
          </BottomModal>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    flexDirection: "row",
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 12,
  },
  modal: {
    paddingTop: 16,
    paddingHorizontal: 8,
  },
  actionBtn: {
    flexBasis: 50,
    marginHorizontal: 4,
    paddingHorizontal: 6,
  },
  btn: {
    flex: 1,
    marginHorizontal: 4,
    paddingHorizontal: 6,
  },
  bannerBox: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  button: {
    width: "100%",
    height: "auto",
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  buttonIcon: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: colors.lightLive,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonLabelContainer: {
    flex: 1,
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    marginHorizontal: 10,
  },
  buttonLabel: {
    color: colors.darkBlue,
    fontSize: 18,
    lineHeight: 22,
  },
  buttonDesc: {
    color: colors.grey,
    fontSize: 13,
    lineHeight: 16,
  },
  extraButton: {
    flexShrink: 1,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "flex-end",
  },
  timeWarn: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "flex-end",
    borderRadius: 4,
    backgroundColor: colors.lightFog,
    padding: 8,
  },
  timeLabel: {
    marginLeft: 8,
    fontSize: 12,
    lineHeight: 16,
    color: colors.grey,
  },
  disabledButton: {
    color: colors.grey,
  },
});
