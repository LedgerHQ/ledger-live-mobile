# ledger-live-mobile

Mobile application for the Ledger Wallet

## Pre-requisite

- Node LTS version
- Yarn 1.10.1 or above
- Ruby setup with Bundler https://bundler.io/

### iOS

- XCode

### Android

- Android studio

## Scripts

### `yarn install`

install dependencies.

### `bundle install`

install Gem dependencies.

### `yarn start`

Runs your app in development mode.

Sometimes you may need to reset or clear the React Native packager's cache. To do so, you can pass the `--reset-cache` flag to the start script:

```
yarn start -- --reset-cache
```

#### `yarn test`

#### `yarn run ios`

or `open ios/ledgerlivemobile.xcodproj`

#### `yarn run android`

or open `android/` in Android Studio.

## Environment variables

Optional environment variables you can put in `.env`, `.env.production` or `.env.staging` for debug, release, or staging release builds respectively

```
DEBUG_COMM_HTTP_PROXY=http://localhost:8435   # enable a dev mode to use the device over HTTP. use with https://github.com/LedgerHQ/ledgerjs/tree/master/packages/hw-http-proxy-devserver
BRIDGESTREAM_DATA=...       # come from console.log of the desktop app during the qrcode export. allow to bypass the bridgestream scanning
DEBUG_RNDEBUGGER=1          # enable react native debugger
```

## Troobleshooting

### XCode 10

When trying to build with XCode 10 and React Native v0.57.0, you might have issues with third party packages from React Native.  
To solve this issue you must:

```sh
./node_modules/react-native/scripts/ios-install-third-party.sh
```

The build on XCode 10 should work then.
