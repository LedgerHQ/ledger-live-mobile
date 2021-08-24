import React, { useState, useCallback } from "react";
import { storiesOf } from "@storybook/react-native";
import { withKnobs, text, button } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";
import Tooltip from "@components/Layout/Modal/Tooltip";
import Text from "@components/Text";
import CenterView from "../../CenterView";

const TooltipStory = () => {
  const [isOpen, setIsOpen] = useState(true);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  button("Open modal", openModal);

  return (
    <Tooltip
      isOpen={isOpen}
      onClose={() => {
        action("onClose")();
        setIsOpen(false);
      }}
    >
        <>
            <Text type={"h3"}>{text("title", "TITLE")}</Text>
            <Text type={"body"}>{text("description", "Description")}</Text>
        </>
    </Tooltip>
  );
};

storiesOf("Layout", module)
  .addDecorator(withKnobs)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .add("Modal/Tooltip", () => <TooltipStory />);
