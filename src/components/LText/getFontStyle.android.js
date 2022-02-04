/* @flow */
import i18next from "i18next";
import type { Opts, Res } from ".";

export default ({
  bold,
  semiBold,
  monospace,
  preferredFontFamily,
}: Opts = {}): Res => {
  let family = monospace ? "monospace" : "Inter";

  if (!monospace && ["ar"].includes(i18next.language)) {
    family = "Cairo";
  }

  if (preferredFontFamily) {
    family = preferredFontFamily;
  }

  let weight;
  if (semiBold) {
    weight = "SemiBold";
  } else if (bold) {
    weight = "Bold";
  } else {
    weight = "Regular";
  }

  const fontFamily = monospace ? family : `${family}-${weight}`;
  return { fontFamily, fontWeight: "normal" };
};
