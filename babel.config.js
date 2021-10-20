module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    "react-native-reanimated/plugin",
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
  ],
};
