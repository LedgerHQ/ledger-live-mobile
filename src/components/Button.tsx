import React, { useCallback, memo, useContext, useMemo } from "react";
import { useIsFocused } from "@react-navigation/native";
import { Button } from "@ledgerhq/native-ui";
import ButtonUseTouchable from "../context/ButtonUseTouchable";
import { track } from "../analytics";

const inferType = (type: string) => {
  switch (type) {
    case "primary":
    case "lightPrimary":
      return "shade";
    case "alert": 
      return "error";
    case "negativePrimary":
    case "secondary":
    case "lightSecondary":
    case "darkSecondary":
    case "greySecondary":
    case "tertiary":
      return "main";
    default:
      return type;
  }
};

export type BaseButtonProps = {
  // when on press returns a promise,
  // the button will toggle in a pending state and
  // will wait the promise to complete before enabling the button again
  // it also displays a spinner if it takes more than WAIT_TIME_BEFORE_SPINNER
  onPress?: () => any;
  // text of the button
  title?: React.ReactNode | string;
  Icon?: React.ComponentType<{ size: number; color: string }>;
  disabled?: boolean;
  // for analytics
  event?: string;
  eventProperties?: Object;
  testID?: string;
  type?: string
};

type Props = BaseButtonProps & {
  useTouchable: boolean;
  isFocused: boolean;
};

function ButtonWrapped(props: BaseButtonProps) {
  const isFocused = useIsFocused(); // @Warning be careful not to import the wrapped button outside of navigation context
  const useTouchable = useContext(ButtonUseTouchable);
  return (
    <BaseButton {...props} useTouchable={useTouchable} isFocused={isFocused} />
  );
}

export function BaseButton({
  // required props
  title,
  onPress,
  Icon,
  disabled,
  useTouchable,
  event,
  eventProperties,
  type,
  ...otherProps
}: Props) {
  const onPressHandler = useCallback(async () => {
    if (!onPress) return;
    if (event) {
      track(event, eventProperties);
    }
    onPress();
  }, [event, eventProperties, onPress]);

  const isDisabled = disabled || !onPress;

  const containerSpecificProps = useTouchable ? {} : { enabled: !isDisabled };

  function getTestID() {
    // $FlowFixMe
    if (isDisabled || !otherProps.isFocused) return undefined;
    if (otherProps.testID) return otherProps.testID;

    switch (type) {
      case "primary":
        return "Proceed";
      default:
        return event;
    }
  }
  const testID = useMemo(getTestID, [
    isDisabled,
    otherProps.isFocused,
    otherProps.testID,
    event,
    type,
  ]);

  return (
    <Button
      type={inferType(type)}
      onPress={isDisabled ? undefined : onPressHandler}
      Icon={Icon}
      {...containerSpecificProps}
      {...otherProps}
      testID={testID}
    >
      {title || null}
    </Button>
  );
}

export default memo<BaseButtonProps>(ButtonWrapped);
