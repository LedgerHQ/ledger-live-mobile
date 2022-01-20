/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const defaultSourceExts = require("metro-config/src/defaults/defaults")
  .sourceExts;

module.exports = {
  resolver: {
    sourceExts: process.env.V3
      ? ["tsx", "ts", "jsx", "js", "json", "cjs"]
      : [...defaultSourceExts, "cjs"],
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
