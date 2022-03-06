import React, { ReactNode } from "react";

import { Button } from "@ledgerhq/native-ui";

type ChoiceButtonProps = {
  disabled?: boolean;
  onSelect: Function;
  label: ReactNode;
  description?: ReactNode;
  Icon: any;
  extra?: ReactNode;
  event: string;
  eventProperties: any;
  navigationParams?: any[];
  enableActions?: string;
};

const ChoiceButton = ({
  event,
  eventProperties,
  disabled,
  label,
  Icon,
  onSelect,
  navigationParams,
  enableActions,
}: ChoiceButtonProps) => (
  <Button
    onPress={() => onSelect({ navigationParams, enableActions })}
    type={"shade"}
    outline
    size={"small"}
    disabled={disabled}
    Icon={Icon}
    iconPosition={"left"}
    event={event}
    eventProperties={eventProperties}
    mr={3}
    backgroundColor={'red'}
  >
    {label}
  </Button>
);

export default ChoiceButton;
