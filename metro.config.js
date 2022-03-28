/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

/* eslint-disable no-console */

module.exports = {
  resolver: {
    sourceExts: ["tsx", "ts", "jsx", "js", "json", "cjs"],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

const getIntlPolyfills = () => {
  const regions = require("./src/screens/Settings/General/regions.json");
  const regionsKeys = Object.keys(regions);
  const polyfills = [
    "@formatjs/intl-getcanonicallocales/polyfill",
    "@formatjs/intl-locale/polyfill",
  ];
  [
    {
      prefix: "@formatjs/intl-pluralrules",
      supportedLocales: require("@formatjs/intl-pluralrules/supported-locales")
        .supportedLocales,
    },
    {
      prefix: "@formatjs/intl-numberformat",
      supportedLocales: require("@formatjs/intl-numberformat/supported-locales")
        .supportedLocales,
    },
    {
      prefix: "@formatjs/intl-datetimeformat",
      supportedLocales: require("@formatjs/intl-datetimeformat/supported-locales")
        .supportedLocales,
    },
  ].forEach(({ prefix, supportedLocales }) => {
    polyfills.push(`${prefix}/polyfill`);
    supportedLocales.forEach(supportedLocale => {
      if (
        regionsKeys.find(
          regionLocale =>
            regionLocale === supportedLocale ||
            (supportedLocale.split("-").length === 1 &&
              regionLocale.startsWith(supportedLocale)),
        )
      )
        polyfills.push(`${prefix}/locale-data/${supportedLocale}`);
    });
  });
  polyfills.push("@formatjs/intl-datetimeformat/add-all-tz");
  return polyfills;
};

const fs = require("fs");
const path = require("path");

fs.writeFile(
  path.resolve("./src/generated/intlPolyfills.js"),
  `/** file generated in metro.config.js */
${getIntlPolyfills()
  .map(str => `import "${str}";`)
  .join("\n")}\n`,
  err => {
    if (err) throw err;
    else console.log("Intl polyfill imports generated");
  },
);
