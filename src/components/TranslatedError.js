// @flow
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

type Props = {
  error: ?Error,
  field?: "title" | "description",
};

export default function TranslatedError({ error, field = "title" }: Props) {
  const { t } = useTranslation();
  if (!error) return null;
  if (typeof error !== "object") {
    // this case should not happen (it is supposed to be a ?Error)
    console.error(`TranslatedError invalid usage: ${String(error)}`);
    if (typeof error === "string") {
      return error;
    }
    return null;
  }
  // $FlowFixMe
  const arg: Object = { message: error.message, returnObjects: true, ...error };
  if (error.name) {
    let translation = t(`errors.${error.name}.${field}`, arg);
    if (translation !== `errors.${error.name}.${field}`) {
      if (typeof translation === "object" && "productName" in arg) {
        // it has specific translation for different device and platform
        const platform = Platform.OS;
        const device = arg.productName.includes("Nano S") ? "nanoS" : "nanoX";
        translation = t(
          `errors.${error.name}.${field}.${platform}.${device}`,
          arg,
        );
        if (
          translation !== `errors.${error.name}.${field}.${platform}.${device}`
        ) {
          return translation;
        }
      } else if (typeof translation === "string") {
        return translation;
      }
    }
  }
  return t(`errors.generic.${field}`, arg);
}
