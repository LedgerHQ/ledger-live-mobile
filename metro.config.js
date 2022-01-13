/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
/* eslint-disable import/no-extraneous-dependencies */

const path = require("path");
const defaultSourceExts = require("metro-config/src/defaults/defaults")
  .sourceExts;
const MetroSymlinksResolver = require("@rnx-kit/metro-resolver-symlinks");

// Emulate what the ./node_modules/.bin/react-native binary is doing by adding node_modules paths.
// Needed because the react native prod build scripts call react-native/cli.js which does not set these paths.
// They will serve as fallbacks when the webpack resolver (enhanced-resolver) used by MetroSymlinksResolver
// fails to resolve some modules.
const nodeModulesPaths = [
  path.join(__dirname, "node_modules"),
  path.join(__dirname, "node_modules/.pnpm/node_modules"),
];

module.exports = {
  projectRoot: __dirname,
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    nodeModulesPaths,
    // MetroSymlinksResolver resolves symlinked dependencies which maks metro play along nice with pnpm.
    // In practice, it is just a bit more complicated than that unfortunately…
    resolveRequest: MetroSymlinksResolver({
      remapModule: (context, moduleName, _platform) => {
        // MetroSymlinksResolver produces the incorrect "./dist/npm/common/npm/common/wswrapper.js" resolution here.
        // It's like it adds up the package.json "browser" + "react-native" fields paths…
        if (
          context.originModulePath.includes("ripple-lib@1.10.0") &&
          moduleName === "./dist/npm/common/wswrapper.js"
        ) {
          return "./wswrapper.js";
        }

        // "package.js" contains "module.meta" calls that will not work with the react-native env.
        // To solve this replace with "packageInfo.cjs" which is safe.
        if (
          context.originModulePath.includes("@polkadot") &&
          moduleName === "./packageInfo.js"
        ) {
          return "./packageInfo.cjs";
        }

        // For other modules, it seems to be fine :).
        return moduleName;
      },
    }),
    sourceExts: [...defaultSourceExts, "cjs"],
    // Watchman does not crawl symlinks
    useWatchman: false,
  },
};
