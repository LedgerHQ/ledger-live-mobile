// @flow

const nanoS = {
  plugAndPinCode: {
    light: require("../../animations/nanoS/1PlugAndPinCode/light.json"),
    dark: require("../../animations/nanoS/1PlugAndPinCode/dark.json"),
  },
  enterPinCode: {
    light: require("../../animations/nanoS/3EnterPinCode/light.json"),
    dark: require("../../animations/nanoS/3EnterPinCode/dark.json"),
  },
  quitApp: {
    light: require("../../animations/nanoS/4QuitApp/light.json"),
    dark: require("../../animations/nanoS/4QuitApp/dark.json"),
  },
  allowManager: {
    light: require("../../animations/nanoS/5AllowManager/light.json"),
    dark: require("../../animations/nanoS/5AllowManager/dark.json"),
  },
  openApp: {
    light: require("../../animations/nanoS/6OpenApp/light.json"),
    dark: require("../../animations/nanoS/6OpenApp/dark.json"),
  },
  validate: {
    light: require("../../animations/nanoS/7Validate/light.json"),
    dark: require("../../animations/nanoS/7Validate/dark.json"),
  },
};

const nanoX = {
  plugAndPinCode: {
    light: require("../../animations/nanoX/1PlugAndPinCode/light.json"),
    dark: require("../../animations/nanoX/1PlugAndPinCode/dark.json"),
  },
  enterPinCode: {
    light: require("../../animations/nanoX/3EnterPinCode/light.json"),
    dark: require("../../animations/nanoX/3EnterPinCode/dark.json"),
  },
  quitApp: {
    light: require("../../animations/nanoX/4QuitApp/light.json"),
    dark: require("../../animations/nanoX/4QuitApp/dark.json"),
  },
  allowManager: {
    light: require("../../animations/nanoX/5AllowManager/light.json"),
    dark: require("../../animations/nanoX/5AllowManager/dark.json"),
  },
  openApp: {
    light: require("../../animations/nanoX/6OpenApp/light.json"),
    dark: require("../../animations/nanoX/6OpenApp/dark.json"),
  },
  validate: {
    light: require("../../animations/nanoX/7Validate/light.json"),
    dark: require("../../animations/nanoX/7Validate/dark.json"),
  },
};

const animations = { nanoX, nanoS };

type InferredKeys = $Keys<typeof nanoS>;

export default function getDeviceAnimation({
  modelId,
  // theme,
  key,
}: {
  modelId: "nanoX" | "nanoS",
  // theme: "light" | "dark",
  key: InferredKeys,
}) {
  const lvl1 = animations[modelId] || animations.nanoX;
  const lvl2 = lvl1[key] || animations.nanoX[key];
  // if (theme === "dark" && lvl2.dark) return lvl2.dark;
  return lvl2.light;
}
