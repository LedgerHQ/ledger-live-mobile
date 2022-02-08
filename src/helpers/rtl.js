import { I18nManager } from "react-native";

export const dir = (ltr: any, rtl: any) => (I18nManager.isRTL ? rtl : ltr);
