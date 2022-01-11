/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
/* eslint-disable import/no-extraneous-dependencies */

const defaultSourceExts = require("metro-config/src/defaults/defaults")
  .sourceExts;
const MetroSymlinksResolver = require("@rnx-kit/metro-resolver-symlinks");

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    // MetroSymlinksResolver resolves symlinked dependencies which maks metro play along nice with pnpm.
    // In practice, it is just a bit more complicated than that unfortunately…
    resolveRequest: MetroSymlinksResolver({
      remapModule: (_context, moduleName, _platform) => {
        // MetroSymlinksResolver produces the incorrect "./dist/npm/common/npm/common/wswrapper.js" resolution here.
        // It's like it adds up the package.json "browser" + "react-native" fields paths…
        if (
          _context.originModulePath.includes("@ripple-lib") &&
          moduleName === "./dist/npm/common/wswrapper.js"
        ) {
          return "./wswrapper.js";
        }

        // "package.js" contains "module.meta" calls that will not work with the react-native env.
        // To solve this replace with "packageInfo.cjs" which is safe.
        if (
          _context.originModulePath.includes("@polkadot") &&
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
