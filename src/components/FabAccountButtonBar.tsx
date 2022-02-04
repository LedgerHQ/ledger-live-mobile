import React, {
  useCallback,
  memo,
  useState,
  ComponentType,
  ReactElement,
  ReactNode,
} from "react";
import { useNavigation, useTheme } from "@react-navigation/native";

import { AccountLike, Account } from "@ledgerhq/live-common/lib/types";

import { Button, Flex } from "@ledgerhq/native-ui";
import ChoiceButton from "./ChoiceButton";
import InfoModal from "./InfoModal";

type ActionButtonEventProps = {
  navigationParams?: any[];
  confirmModalProps?: {
    withCancel?: boolean;
    id?: string;
    title?: string | ReactElement;
    desc?: string | ReactElement;
    Icon?: ComponentType;
    children?: ReactNode;
    confirmLabel?: string | ReactElement;
    confirmProps?: any;
  };
  Component?: ComponentType;
  enableActions?: string;
};

type ActionButton = ActionButtonEventProps & {
  label: ReactNode;
  Icon?: ComponentType<{ size: number; color: string }>;
  event: string;
  eventProperties?: { [key: string]: any };
  Component?: ComponentType;
};

type Props = {
  buttons: ActionButton[];
  actions?: { default: ActionButton[]; lending?: ActionButton[] };
  account?: AccountLike;
  parentAccount?: Account;
};

function FabAccountButtonBar({
  buttons,
  actions,
  account,
  parentAccount,
}: Props) {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [next, setNext] = useState();
  const [displayedActions, setDisplayedActions] = useState();

  const [infoModalProps, setInfoModalProps] = useState<
    ActionButtonEventProps | undefined
  >();
  const [isModalInfoOpened, setIsModalInfoOpened] = useState();

  const onNavigate = useCallback(
    (name: string, options?: any) => {
      const accountId = account ? account.id : undefined;
      const parentId = parentAccount ? parentAccount.id : undefined;
      setNext();
      navigation.navigate(name, {
        ...options,
        params: {
          ...(options ? options.params : {}),
          accountId,
          parentId,
        },
      });
    },
    [account, parentAccount, navigation],
  );

  const onPress = useCallback(
    (data: ActionButtonEventProps) => {
      const { navigationParams, confirmModalProps, enableActions } = data;
      if (!confirmModalProps) {
        setInfoModalProps();
        if (navigationParams) onNavigate(...navigationParams);
        if (enableActions) setDisplayedActions(enableActions);
      } else {
        setInfoModalProps(data);
        setIsModalInfoOpened(true);
      }
    },
    [onNavigate, setIsModalInfoOpened],
  );

  const goToNext = useCallback(() => {
    if (next) {
      // workaround for bottom modal + text input autoFocus issue
      setTimeout(() => onNavigate(...next), 0);
    }
  }, [onNavigate, next]);

  const onContinue = useCallback(() => {
    setIsModalInfoOpened(false);
    onPress({ ...infoModalProps, confirmModalProps: undefined });
  }, [infoModalProps, onPress]);

  const onClose = useCallback(() => {
    setIsModalInfoOpened();
  }, []);

  const onChoiceSelect = useCallback(({ navigationParams, enableActions }) => {
    if (navigationParams) {
      setNext(navigationParams);
      setDisplayedActions();
    }
    if (enableActions) {
      setDisplayedActions(enableActions);
    }
  }, []);

  return (
    <Flex justifyContent={"flex-start"} flexDirection={"row"}>
      {buttons.map(
        (
          { label, Icon, event, eventProperties, Component, ...rest },
          index,
        ) => (
          <Button
            size={"small"}
            Icon={Icon}
            iconPosition={"left"}
            event={event}
            eventProperties={eventProperties}
            type={"color"}
            onPress={() => onPress(rest)}
            key={index}
            mr={3}
            backgroundColor={"red"}
          >
            {label}
          </Button>
        ),
      )}
      {actions?.default?.map((a, i) =>
        a.Component ? (
          <a.Component key={i} />
        ) : (
          <ChoiceButton {...a} key={i} onSelect={onChoiceSelect} />
        ),
      )}
      {isModalInfoOpened && infoModalProps && (
        <InfoModal
          {...(infoModalProps.confirmModalProps
            ? infoModalProps.confirmModalProps
            : {})}
          onContinue={onContinue}
          onClose={onClose}
          isOpened={!!isModalInfoOpened}
        />
      )}
    </Flex>
  );
}

export default memo<Props>(FabAccountButtonBar);
