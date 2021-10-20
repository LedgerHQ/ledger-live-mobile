/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  ...(process.env.V3
    ? {
        resolver: {
          sourceExts: ["tsx", "ts", "jsx", "js"],
        },
      }
    : {}),
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
