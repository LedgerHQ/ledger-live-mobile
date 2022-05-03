import {
  getAccountCurrency,
  getAccountUnit,
} from "@ledgerhq/live-common/lib/account";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";
import { getCurrencyColor } from "@ledgerhq/live-common/lib/currencies";
import { useValidators } from "@ledgerhq/live-common/lib/families/solana/react";
import {
  SolanaStakeWithMeta,
  StakeAction,
  TransactionModel,
} from "@ledgerhq/live-common/lib/families/solana/types";
import {
  assertUnreachable,
  sweetch,
} from "@ledgerhq/live-common/lib/families/solana/utils";
import { ValidatorsAppValidator } from "@ledgerhq/live-common/lib/families/solana/validator-app";
import { AccountLike } from "@ledgerhq/live-common/lib/types";
import { Text } from "@ledgerhq/native-ui";
import { useTheme } from "@react-navigation/native";
import { BigNumber } from "bignumber.js";
import invariant from "invariant";
import { capitalize } from "lodash/fp";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Trans } from "react-i18next";
import { Animated, StyleSheet, View } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import Icon from "react-native-vector-icons/Feather";
import { useSelector } from "react-redux";
import { TrackScreen } from "../../../analytics";
import { rgba } from "../../../colors";
import Alert from "../../../components/Alert";
import Button from "../../../components/Button";
import Circle from "../../../components/Circle";
import CurrencyIcon from "../../../components/CurrencyIcon";
import CurrencyUnitValue from "../../../components/CurrencyUnitValue";
import Touchable from "../../../components/Touchable";
import { ScreenName } from "../../../const";
import { accountScreenSelector } from "../../../reducers/accounts";
import DelegatingContainer from "../../tezos/DelegatingContainer";
import ValidatorImage from "../shared/ValidatorImage";

type Props = {
  navigation: any;
  route: { params: RouteParams };
};

type RouteParams = {
  delegationAction?: DelegationAction;
  validator?: ValidatorsAppValidator;
  accountId: string;
  parentId?: string;
};

type DelegationAction =
  | {
      kind: "new";
    }
  | {
      kind: "change";
      stakeWithMeta: SolanaStakeWithMeta;
      stakeAction: StakeAction;
    };

export default function DelegationSummary({ navigation, route }: Props) {
  const { delegationAction, validator } = route.params;
  const { colors } = useTheme();
  const { account, parentAccount } = useSelector(accountScreenSelector(route));

  invariant(delegationAction, "delegation action must be defined");
  invariant(account, "account must be defined");
  invariant(account.type === "Account", "account type must be Account");

  const validators = useValidators(account.currency);

  const chosenValidator = useMemo(() => {
    if (validator !== undefined) {
      return validator;
    }

    if (delegationAction.kind === "new") {
      return validators[0];
    }

    const { stake } = delegationAction.stakeWithMeta;

    if (stake.delegation === undefined) {
      return undefined;
    }

    return validators.find(
      v => v.voteAccount === stake.delegation?.voteAccAddr,
    );
  }, [validators, validator, delegationAction]);

  const {
    transaction,
    setTransaction,
    status,
    bridgePending,
    bridgeError,
  } = useBridgeTransaction(() => {
    return {
      account,
      parentAccount,
    };
  });

  useEffect(() => {
    setTransaction({
      family: "solana",
      // TODO: fix amount
      amount: new BigNumber(1),
      recipient: "",
      model: txModelByDelegationAction(
        delegationAction,
        validators[0],
        chosenValidator,
      ),
    });
  }, [delegationAction, chosenValidator, validators, setTransaction]);

  invariant(transaction, "transaction must be defined");
  invariant(transaction.family === "solana", "transaction solana");

  const [rotateAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
      ]),
    ).start();
    return () => {
      rotateAnim.setValue(0);
    };
  }, [rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    // $FlowFixMe
    outputRange: ["0deg", "30deg"],
  });

  const onChangeDelegator = useCallback(() => {
    rotateAnim.setValue(0);
    navigation.navigate(ScreenName.DelegationSelectValidator, route.params);
  }, [rotateAnim, navigation, route.params]);

  const onChangeAmount = () => {};

  const currency = getAccountCurrency(account);
  const color = getCurrencyColor(currency);

  const onContinue = useCallback(async () => {
    navigation.navigate(ScreenName.DelegationSelectDevice, {
      accountId: account.id,
      parentId: parentAccount && parentAccount.id,
      transaction,
      status,
    });
  }, [status, account, parentAccount, navigation, transaction]);

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: colors.background }]}
      forceInset={{ bottom: "always" }}
    >
      <TrackScreen category="DelegationFlow" name="Summary" />

      <View style={styles.body}>
        <DelegatingContainer
          undelegation={undelegation(delegationAction)}
          left={
            <View style={styles.delegatingAccount}>
              <Circle size={64} bg={rgba(color, 0.2)}>
                <CurrencyIcon size={32} currency={currency} />
              </Circle>
              <AccountBalanceTag account={account} />
            </View>
          }
          right={
            supportValidatorChange(delegationAction) ? (
              <Touchable
                event="DelegationFlowSummaryChangeCircleBtn"
                onPress={onChangeDelegator}
              >
                <Circle
                  size={70}
                  style={[
                    styles.validatorCircle,
                    { borderColor: colors.primary },
                  ]}
                >
                  <Animated.View
                    style={{
                      transform: [
                        {
                          rotate,
                        },
                      ],
                    }}
                  >
                    <ValidatorImage
                      imgUrl={chosenValidator?.avatarUrl}
                      name={
                        chosenValidator?.name ?? chosenValidator?.voteAccount
                      }
                    />
                  </Animated.View>
                  <ChangeDelegator />
                </Circle>
              </Touchable>
            ) : (
              <ValidatorImage
                imgUrl={chosenValidator?.avatarUrl}
                name={chosenValidator?.name ?? chosenValidator?.voteAccount}
              />
            )
          }
        />

        <View style={styles.summary}>
          <SummaryWords
            onChangeValidator={onChangeDelegator}
            onChangeAmount={onChangeAmount}
            validator={chosenValidator}
            delegationAction={delegationAction}
            account={account}
          />
        </View>
        {transaction.model.kind === "stake.undelegate" ? (
          <Alert type="help">
            <Trans i18nKey="delegation.warnUndelegation" />
          </Alert>
        ) : (
          <Alert type="help">
            <Trans i18nKey="delegation.warnDelegation" />
          </Alert>
        )}
      </View>
      <View style={styles.footer}>
        <Button
          event="SummaryContinue"
          type="primary"
          title={<Trans i18nKey="common.continue" />}
          containerStyle={styles.continueButton}
          onPress={onContinue}
          disabled={bridgePending || !!bridgeError}
          pending={bridgePending}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "column",
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "space-around",
  },
  validatorCircle: {
    borderWidth: 1,
    borderStyle: "dashed",
  },
  changeDelegator: {
    position: "absolute",
    right: -4,
    top: -4,
  },
  delegatingAccount: {
    paddingTop: 26,
  },
  accountBalanceTag: {
    marginTop: 8,
    borderRadius: 4,
    padding: 4,
    alignItems: "center",
  },
  accountBalanceTagText: {
    fontSize: 11,
  },
  accountName: {
    maxWidth: 180,
  },
  summary: {
    alignItems: "center",
    marginVertical: 30,
  },
  summaryLine: {
    marginVertical: 10,
    flexDirection: "row",
    height: 40,
    alignItems: "center",
  },
  summaryWords: {
    marginRight: 6,
    fontSize: 18,
  },
  validatorSelection: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 4,
    height: 40,
  },
  validatorSelectionText: {
    paddingHorizontal: 8,
    fontSize: 18,
    maxWidth: 240,
  },
  validatorSelectionIcon: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 40,
  },
  footer: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  continueButton: {
    alignSelf: "stretch",
    marginTop: 12,
  },
});

function txModelByDelegationAction(
  delegationAction: DelegationAction,
  defaultValidator: ValidatorsAppValidator,
  chosenValidator?: ValidatorsAppValidator,
): TransactionModel {
  if (delegationAction.kind === "new") {
    return {
      kind: "stake.createAccount",
      uiState: {
        delegate: {
          voteAccAddress: (chosenValidator ?? defaultValidator).voteAccount,
        },
      },
    };
  }

  const {
    stakeAction,
    stakeWithMeta: { stake },
  } = delegationAction;

  invariant(stake.delegation, "stake delegation must be defined");

  const { stakeAccAddr, delegation } = stake;

  switch (stakeAction) {
    case "activate":
    case "reactivate":
      return {
        kind: "stake.delegate",
        uiState: {
          stakeAccAddr,
          voteAccAddr:
            chosenValidator?.voteAccount ?? delegation?.voteAccAddr ?? "-",
        },
      };
    case "deactivate":
      return {
        kind: "stake.undelegate",
        uiState: {
          stakeAccAddr,
        },
      };
    case "withdraw":
      return {
        kind: "stake.withdraw",
        uiState: {
          stakeAccAddr,
        },
      };
    default:
      assertUnreachable(stakeAction);
  }
}

function supportValidatorChange(delegationAction: DelegationAction) {
  return (
    delegationAction.kind === "new" ||
    delegationAction.stakeAction === "activate"
  );
}

function undelegation(delegationAction: DelegationAction) {
  if (delegationAction.kind === "new") {
    return false;
  }
  const { stakeAction } = delegationAction;
  return stakeAction === "deactivate" || stakeAction === "withdraw";
}

function SummaryWords({
  delegationAction,
  validator,
  account,
  onChangeValidator,
  onChangeAmount,
}: {
  delegationAction: DelegationAction;
  validator?: ValidatorsAppValidator;
  account: AccountLike;
  onChangeValidator: () => void;
  onChangeAmount: () => void;
}) {
  const i18nActionKey =
    delegationAction.kind === "new"
      ? "iDelegate"
      : `i${capitalize(delegationAction.stakeAction)}`;
  return (
    <>
      <Line>
        <Words>
          <Trans i18nKey={`solana.delegation.${i18nActionKey}`} />
        </Words>
        {delegationAction.kind === "new" ||
        delegationAction.stakeAction === "activate" ? (
          <Touchable onPress={onChangeAmount}>
            <ValidatorSelection name={"10 SOL"} />
          </Touchable>
        ) : (
          <ValidatorSelection readOnly name={"10 SOL"} />
        )}
      </Line>
      <Line>
        <Words>
          {delegationAction.kind === "new" ? (
            <Trans i18nKey="delegation.to" />
          ) : (
            <Trans i18nKey="solana.delegation.delegatedTo" />
          )}
        </Words>
        {delegationAction.kind === "new" ||
        delegationAction.stakeAction === "activate" ? (
          <Touchable onPress={onChangeValidator}>
            <ValidatorSelection
              name={validator?.name ?? validator?.voteAccount ?? "-"}
            />
          </Touchable>
        ) : (
          <ValidatorSelection
            readOnly
            name={validator?.name ?? validator?.voteAccount ?? "-"}
          />
        )}
      </Line>
    </>
  );
}

const AccountBalanceTag = ({ account }: { account: AccountLike }) => {
  const unit = getAccountUnit(account);
  const { colors } = useTheme();
  return (
    <View
      style={[styles.accountBalanceTag, { backgroundColor: colors.lightFog }]}
    >
      <Text
        fontWeight="semiBold"
        numberOfLines={1}
        style={styles.accountBalanceTagText}
        color="smoke"
      >
        <CurrencyUnitValue showCode unit={unit} value={account.balance} />
      </Text>
    </View>
  );
};

const ChangeDelegator = () => {
  const { colors } = useTheme();
  return (
    <Circle style={styles.changeDelegator} bg={colors.live} size={26}>
      <Icon size={13} name="edit-2" color={colors.white} />
    </Circle>
  );
};

const Line = ({ children }: { children: ReactNode }) => (
  <View style={styles.summaryLine}>{children}</View>
);

const Words = ({
  children,
  highlighted,
  style,
}: {
  children: ReactNode;
  highlighted?: boolean;
  style?: any;
}) => (
  <Text
    numberOfLines={1}
    fontWeight={highlighted ? "bold" : "semiBold"}
    style={[styles.summaryWords, style]}
    color={highlighted ? "live" : "smoke"}
  >
    {children}
  </Text>
);

const ValidatorSelection = ({
  name,
  readOnly,
}: {
  name: string;
  readOnly?: boolean;
}) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.validatorSelection,
        { backgroundColor: rgba(colors.live, 0.2) },
      ]}
    >
      <Text
        fontWeight="bold"
        numberOfLines={1}
        style={styles.validatorSelectionText}
        color="live"
      >
        {name}
      </Text>
      {readOnly ? null : (
        <View
          style={[
            styles.validatorSelectionIcon,
            { backgroundColor: colors.live },
          ]}
        >
          <Icon size={16} name="edit-2" color={colors.white} />
        </View>
      )}
    </View>
  );
};
