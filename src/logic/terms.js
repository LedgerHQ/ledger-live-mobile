// @flow
import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const url =
  "https://github.com/LedgerHQ/ledger-live-mobile/blob/master/TERMS.md";

const legacyTermsUrl =
  "https://raw.githubusercontent.com/LedgerHQ/ledger-live-mobile/master/TERMS.md";

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
    console.error(`Failed to parse terms version's dates: ${error}`);

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

export async function load() {
  const url = legacyTermsUrl;
  const r = await fetch(url);
  if (r.status >= 400 && r.status < 600) {
    throw new Error("");
  }
  const markdown = await r.text();
  return markdown;
}

export const useTerms = () => {
  const [terms, setTerms] = useState(null);
  const [error, setError] = useState(null);

  const loadTerms = () => load().then(setTerms, setError);

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
