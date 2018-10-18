fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew cask install fastlane`

# Available Actions
### bump_version
```
fastlane bump_version
```
Bump the iOS and Android version with a commit and tag.

----

## iOS
### ios build
```
fastlane ios build
```
Build the app with the specified `scheme`. Defaults to `ledgerlivemobile`.
### ios beta
```
fastlane ios beta
```
Submit a new Beta Build to Apple TestFlight

----

## Android
### android snapshot_build
```
fastlane android snapshot_build
```
Create a Release build versionned as <current version>-<git branch>-<last commit hash>
### android build
```
fastlane android build
```
Build the app apk for the specified build `type`. Defaults to `Release`

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
