import React from "react";
import { Flex } from "@ledgerhq/native-ui";

export { default as Intro } from "./Intro";
export { default as Instructions } from "./Instructions";
export { default as PinCode } from "./PinCode";
export { default as PinCodeInstructions } from "./PinCodeInstructions";
export { default as RecoveryPhrase } from "./RecoveryPhrase";
export { default as RecoveryPhraseInstructions } from "./RecoveryPhraseInstructions";
export { default as RecoveryPhraseSetup } from "./RecoveryPhraseSetup";
export { default as HideRecoveryPhrase } from "./HideRecoveryPhrase";
export { default as PairNew } from "./PairNew";
export { default as ConnectNano } from "./ConnectNano";

const Scene = ({ children }: { children: React.ReactNode }) => (
  <Flex flex={1} justifyContent="space-between" my={8} mx={6}>
    {children}
  </Flex>
);

export default Scene;
