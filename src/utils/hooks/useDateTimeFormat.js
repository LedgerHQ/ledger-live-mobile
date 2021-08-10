// @flow
import { useSelector } from "react-redux";
import { languageSelector } from "../../reducers/settings.js";

const useDateTimeFormat = (options?: Intl$DateTimeFormatOptions = {}) => {
  const currentLanguage = useSelector(languageSelector);
  const formatter = new Intl.DateTimeFormat(currentLanguage, options);

  return formatter.format;
};

export default useDateTimeFormat;
