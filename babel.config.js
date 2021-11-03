module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    ...(process.env.V3
      ? [
          [
            "module-resolver",
            {
              root: ["./src"],
              extensions: [
                ".ts",
                ".tsx",
                ".ios.tsx",
                ".android.tsx",
                ".ios.js",
                ".android.js",
                ".js",
                ".json",
              ],
            },
          ],
        ]
      : []),
    "react-native-reanimated/plugin",
  ],
};
