// @flow
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { ScreenName } from "../const";

import Button from "./Button";

interface Props {
  title: string;
}

export default function ImportAccountsButton({ title }: Props) {
  const { navigate } = useNavigation();

  return (
    <Button
      event="ImportAccounts"
      type="primary"
      title={title}
      onPress={() => navigate(ScreenName.ImportAccounts)}
    />
  );
}
