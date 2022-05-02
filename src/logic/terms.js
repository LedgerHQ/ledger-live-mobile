// @flow
import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import logger from "../logger";

export const url =
  "https://github.com/LedgerHQ/ledger-live-mobile/blob/master/TERMS.md";

const termsUrlLocalized = {
  en:
    "https://raw.githubusercontent.com/LedgerHQ/ledger-live-mobile/master/TERMS.md",
  fr:
    "https://raw.githubusercontent.com/LedgerHQ/ledger-live-mobile/master/TERMS.fr.md",
  es:
    "https://raw.githubusercontent.com/LedgerHQ/ledger-live-mobile/master/TERMS.es.md",
  zh:
    "https://raw.githubusercontent.com/LedgerHQ/ledger-live-mobile/master/TERMS.zh.md",
  ru:
    "https://raw.githubusercontent.com/LedgerHQ/ledger-live-mobile/master/TERMS.ru.md",
};

const currentTermsRequired = "2022-05-10";
const currentLendingTermsRequired = "2020-11-10";

function isAcceptedVersionUpToDate(acceptedVersion, currentVersion) {
  if (!acceptedVersion) {
    return false;
  }

  try {
    const acceptedTermsVersion = new Date(acceptedVersion);
    const currentTermsVersion = new Date(currentVersion);

    return acceptedTermsVersion >= currentTermsVersion;
  } catch (error) {
    logger.error(`Failed to parse terms version's dates: ${error}`);

    return false;
  }
}

export async function isAcceptedTerms() {
  return isAcceptedVersionUpToDate(
    await AsyncStorage.getItem("acceptedTermsVersion"),
    currentTermsRequired,
  );
}

export async function isAcceptedLendingTerms() {
  return isAcceptedVersionUpToDate(
    await AsyncStorage.getItem("acceptedLendingTermsVersion"),
    currentLendingTermsRequired,
  );
}

export async function acceptTerms() {
  await AsyncStorage.setItem("acceptedTermsVersion", currentTermsRequired);
}

export async function acceptLendingTerms() {
  await AsyncStorage.setItem(
    "acceptedLendingTermsVersion",
    currentLendingTermsRequired,
  );
}

export async function load(locale: string) {
  const url = termsUrlLocalized[locale] || termsUrlLocalized.en;
  const r = await fetch(url);
  if (r.status >= 400 && r.status < 600) {
    throw new Error("");
  }
  const markdown = await r.text();
  return markdown;
}

export const useTerms = (locale: string) => {
  const [terms, setTerms] = useState(null);
  const [error, setError] = useState(null);

  const loadTerms = () => load(locale).then(setTerms, setError);

  useEffect(() => {
    loadTerms();
  }, []);

  return [terms, error, loadTerms];
};

export const useTermsAccept = () => {
  const [accepted, setAccepted] = useState(true);

  const accept = useCallback(() => {
    acceptTerms().then(() => {
      setAccepted(true);
    });
  }, []);

  useEffect(() => {
    isAcceptedTerms().then(setAccepted);
  }, []);

  return [accepted, accept];
};
