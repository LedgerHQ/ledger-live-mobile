import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useLocale } from "../context/Locale";
import { urls } from "../config/urls";

// Legacy URL
export const url =
  "https://github.com/LedgerHQ/ledger-live-mobile/blob/master/TERMS.md";

// Legacy URL
const legacyTermsUrl =
  "https://raw.githubusercontent.com/LedgerHQ/ledger-live-mobile/master/TERMS.md";

const currentTermsRequired = "2022-05-10";
const currentLendingTermsRequired = "2020-11-10";

function isAcceptedVersionUpToDate(
  acceptedVersion: string,
  currentVersion: string,
) {
  if (!acceptedVersion) {
    return false;
  }

  try {
    const acceptedTermsVersion = new Date(acceptedVersion);
    const currentTermsVersion = new Date(currentVersion);

    return acceptedTermsVersion >= currentTermsVersion;
  } catch (error) {
    console.error(`Failed to parse terms version's dates: ${error}`);

    return false;
  }
}

export async function isAcceptedTerms() {
  const acceptedTermsVersion = await AsyncStorage.getItem(
    "acceptedTermsVersion",
  );

  if (!acceptedTermsVersion) {
    return false;
  }

  return isAcceptedVersionUpToDate(acceptedTermsVersion, currentTermsRequired);
}

export async function isAcceptedLendingTerms() {
  const acceptedLendingTermsVersion = await AsyncStorage.getItem(
    "acceptedLendingTermsVersion",
  );

  if (!acceptedLendingTermsVersion) {
    return false;
  }

  return isAcceptedVersionUpToDate(
    acceptedLendingTermsVersion,
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

export function useLocalizedTermsUrl() {
  const { locale } = useLocale();

  return (urls.terms as Record<string, string>)[locale] || urls.terms.en;
}

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

// Legacy code
export async function load() {
  const url = legacyTermsUrl;
  const r = await fetch(url);
  if (r.status >= 400 && r.status < 600) {
    throw new Error("");
  }
  const markdown = await r.text();
  return markdown;
}

// Legacy code
export const useTerms = () => {
  const [terms, setTerms] = useState(null);
  const [error, setError] = useState(null);

  const loadTerms = () => load().then(setTerms, setError);

  useEffect(() => {
    loadTerms();
  }, []);

  return [terms, error, loadTerms];
};
