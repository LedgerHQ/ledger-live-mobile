// @flow
import Config from "react-native-config";

if (Config.MOCK) {
  console.log("SETTING UP TEST CLIENT");
  import("./bridge/client").then(({ init }) => init());
}
