// @flow
import React from "react";
import { Trans } from "react-i18next";

export default [
  {
    label: <Trans i18nKey="onboarding.quizz.label" />,
    title: <Trans i18nKey="onboarding.quizz.coins.title" />,
    answers: [
      {
        title: <Trans i18nKey="onboarding.quizz.coins.answers.wrong" />,
        correct: false,
      },
      {
        title: <Trans i18nKey="onboarding.quizz.coins.answers.correct" />,
        correct: true,
      },
    ],
  },
  {
    label: <Trans i18nKey="onboarding.quizz.label" />,
    title: <Trans i18nKey="onboarding.quizz.recoveryPhrase.title" />,
    answers: [
      {
        title: (
          <Trans i18nKey="onboarding.quizz.recoveryPhrase.answers.wrong" />
        ),
        correct: false,
      },
      {
        title: (
          <Trans i18nKey="onboarding.quizz.recoveryPhrase.answers.correct" />
        ),
        correct: true,
      },
    ],
  },
  {
    label: <Trans i18nKey="onboarding.quizz.label" />,
    title: <Trans i18nKey="onboarding.quizz.privateKey.title" />,
    answers: [
      {
        title: <Trans i18nKey="onboarding.quizz.privateKey.answers.wrong" />,
        correct: false,
      },
      {
        title: <Trans i18nKey="onboarding.quizz.privateKey.answers.correct" />,
        correct: true,
      },
    ],
  },
];
