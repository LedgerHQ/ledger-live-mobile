import React, {
  useCallback,
  memo,
  useState,
  ComponentType,
  ReactElement,
  ReactNode,
} from "react";
import { useNavigation } from "@react-navigation/native";

import { AccountLike, Account } from "@ledgerhq/live-common/lib/types";

import { Flex } from "@ledgerhq/native-ui";
import ChoiceButton from "./ChoiceButton";
import InfoModal from "./InfoModal";
import Button from "./wrappedUi/Button";

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
  const navigation = useNavigation();

  const [infoModalProps, setInfoModalProps] = useState<
    ActionButtonEventProps | undefined
  >();
  const [isModalInfoOpened, setIsModalInfoOpened] = useState();

  const onNavigate = useCallback(
    (name: string, options?: any) => {
      const accountId = account ? account.id : undefined;
      const parentId = parentAccount ? parentAccount.id : undefined;
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
      const { navigationParams, confirmModalProps } = data;
      if (!confirmModalProps) {
        setInfoModalProps();
        if (navigationParams) onNavigate(...navigationParams);
      } else {
        setInfoModalProps(data);
        setIsModalInfoOpened(true);
      }
    },
    [onNavigate, setIsModalInfoOpened],
  );

  const onContinue = useCallback(() => {
    setIsModalInfoOpened(false);
    onPress({ ...infoModalProps, confirmModalProps: undefined });
  }, [infoModalProps, onPress]);

  const onClose = useCallback(() => {
    setIsModalInfoOpened();
  }, []);

  const onChoiceSelect = useCallback(({ navigationParams }) => {
    if (navigationParams) {
      onNavigate(...navigationParams);
    }
  }, []);

  return (
    <Flex justifyContent={"flex-start"} flexDirection={"row"} pl={3}>
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
