import {
  AppRegistry,
  NativeModules,
  NativeEventEmitter
} from "react-native";
import ExtensionApp from "./src/ledger-connect/extension-app"
import {
  getDeviceAndAddress,
  signPersonalMessage,
  signTransaction,
  solana_signTransaction
} from './src/ledger-connect/lib/utilities';
import * as Sentry from "@sentry/react-native";
import Config from "react-native-config";
import { getEnabled } from "./src/components/HookSentry";
import pkg from "./package.json";

if (__DEV__) {
  // Force logging on since we can't see the debug UI in the extension
  NativeModules.DevSettings.setIsDebuggingRemotely(true);
}

if (Config.SENTRY_DSN && !__DEV__ && !Config.MOCK) {
  const blacklistErrorName = ["NetworkDown"];
  const blacklistErrorDescription = [/Device .* was disconnected/];

  //   Sentry.init({
  //     dns: Config.SENTRY_DSN,
  //     release: `ledger-live-mobile@${pkg.version}`,
  //     beforeSend(event) {
  //       if (!getEnabled()) return null;
  //       // If the error matches blacklistErrorName or blacklistErrorDescription,
  //       // we will not send it to Sentry.
  //       if (event && typeof event === "object") {
  //         const { exception } = event;
  //         if (
  //           exception &&
  //           typeof exception === "object" &&
  //           Array.isArray(exception.values)
  //         ) {
  //           const { values } = exception;
  //           const shouldBlacklist = values.some(item => {
  //             if (item && typeof item === "object") {
  //               const { type, value } = item;
  //               return (typeof type === "string" &&
  //                 blacklistErrorName.some(pattern => type.match(pattern))) ||
  //                 (typeof value === "string" &&
  //                   blacklistErrorDescription.some(pattern =>
  //                     value.match(pattern),
  //                   ))
  //                 ? event
  //                 : null;
  //             }
  //             return null;
  //           });
  //           if (shouldBlacklist) return null;
  //         }
  //       }

  //       return event;
  //     },
  //   });
}

AppRegistry.registerComponent("LedgerConnect", () => ExtensionApp);

// Create emitter
const myModuleEvt = new NativeEventEmitter(NativeModules.EventEmitter)

// Ethereum methods

myModuleEvt.addListener('getAccount', () => {
  console.log(`getAccount event received.`);

  getDeviceAndAddress("Ethereum").then(data => {
    console.log('getAccount event complete')
    NativeModules.EventEmitter.foundDevices(data);
  }).catch(error => {
    handleError(error, "getAccount");
  })
});

myModuleEvt.addListener('personalSign', (data) => {
  console.log(`personalSign event received: ${data}`);

  signPersonalMessage(data).then(signatureResult => {
    console.log('personalSign event complete')
    NativeModules.EventEmitter.signatureComplete(signatureResult);
  }).catch(error => {
    handleError(error, "personalSign");
  })
});

myModuleEvt.addListener('signTransaction', (data) => {
  console.log(`signTransaction event received: ${data}`);

  signTransaction(data).then(signedTransaction => {
    console.log('signTransaction event complete')
    NativeModules.EventEmitter.requestComplete(signedTransaction);
  }).catch(error => {
    handleError(error, "signTransaction");
  })
});


// Solana methods

myModuleEvt.addListener('solana_getAccount', (data) => {
  console.log(`solana_getAccount event received`);

  getDeviceAndAddress("Solana").then(data => {
    console.log('solana_getAccount event complete')
    NativeModules.EventEmitter.foundDevices(data);
  }).catch(error => {
    handleError(error, "solana_getAccount");
  })
});

myModuleEvt.addListener('solana_signAndSendTransaction', (data) => {
  console.log(`solana_signAndSendTransaction event received`);

  solana_signTransaction(data).then(signedTransaction => {
    console.log('solana_signAndSendTransaction event complete')
    NativeModules.EventEmitter.requestComplete(signedTransaction);
  }).catch(error => {
    handleError(error, "solana_signAndSendTransaction");
  })
});

function handleError(error, method) {
  Sentry.captureException(error)
  console.log(`${method} error: ${error}`);
  NativeModules.EventEmitter.transportError(unwrapError(error));
}

function unwrapError(error) {
  const json = JSON.stringify(error)
  if (json === "{}") {
    return `{ "message": "${error.message}" }`
  }
  return json
}