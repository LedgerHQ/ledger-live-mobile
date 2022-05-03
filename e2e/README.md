# ledger-live-mobile e2e testing

This project uses [Detox](https://github.com/wix/Detox) and [Jest](https://jestjs.io/) for end to end testing, please refer to the documentation of those projects for the specifics. In this folder you will find the key parts for testing a flow in the application: the setup, specs and flow definitions.

# Quick Start

Ensure you have Android Studio and Xcode installed with the relevant development/emulator tools installed (see below).

## Android
- Build the apps
  - Debug: `yarn detox build -c android.debug`
  - Staging: `yarn detox build -c android.staging`
- Run the tests
  - Debug: First run `yarn start` in a separate window to run Metro bundler, then `yarn detox test -c android.debug`
  - Staging: `yarn detox test -c android.staging`

## iOS
Use the exact same commands as above but replace `android` with `iOS`.

# Project Structure

- `./bridge`: This contains the code to setup a websocket which allows communication between the test process and the LLM app. This allows us to:
  - create different conditions for testing the app by setting the user data.
  - perform mock device actions
  - do quick navigations around the app (useful for setting up tests)

- `./models`: 

- `./setups`: This is the application data that will be used to start the session, it contains all the information regarding user settings, existing accounts, operations, balances, etc. It allows us to test different scenarios with independent configurations.

- `./specs`: The test suites themselves. We make use of the helpers and combine the snippets from the flows to build the different test scenarios. Ideally we should be able to reuse parts from flows in the specs.

- `config.json` - Configuration for Detox.

- `e2e-bridge-setup`: Used to start the websocket bridge on the client (app) side.

- `environment.js`: Boilerplate code to setup Jest for the Detox tests.

- `global-setup.js`: Run at the start of the test run to start the emulator and kick off the tests.

- `global-teardown.js`: Run at the end of the test run to teardown the test and emulator prcoesses.

- `helpers.js`: Convenience methods for use in the models/tests to make writing tests easier.

- `setup.js`: Run after the global setup. It starts the websocket bridge, sets up the emulators to be more consistent in the test run (for example sets the time to 12.00), and shuts down the websocket bridge. Any logic to be run before and after a test run would go here.

### How to test

> I will focus on Android testing for this but most instructions will still apply to iOS to some extent.

When we make changes that might have an impact on a flow covered by Detox we have to make sure that we still pass the tests or adapt the tests to the new changes if we need to. In order to build and run the detox suite we require:

- A running emulator specifically named `Nexus_5X_API_29_x86` that detox will look for upon launching. We could make this use the first device but as of now it's not dynamic.
- For a staging build
  - `yarn e2e:build --configuration android.staging` to prepare the setup
  - `yarn e2e:test --configuration android.staging` to actually run the tests
- For a debug build
  - Have an instance of metro bundler running, to do this run `yarn start` from the root of LLM
  - `yarn e2e:build --configuration android.debug` to prepare the setup
  - `yarn e2e:test --configuration android.debug` to actually run the tests

