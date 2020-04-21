// @flow
import { useTranslation } from "react-i18next";

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
  const arg: Object = { message: error.message, ...error };
  if (error.name) {
    const translation = t(`errors.${error.name}.${field}`, arg);
    if (translation !== `errors.${error.name}.${field}`) {
      // It is translated
      return translation;
    }
  }
  return t(`errors.generic.${field}`, arg);
}
