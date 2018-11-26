#!/bin/bash

# see https://github.com/react-native-community/react-native-camera#face-detection-steps
if [ -e node_modules/react-native-camera/ios/FaceDetector ] ; then
  rm -rf node_modules/react-native-camera/ios/FaceDetector
fi
cp node_modules/react-native-camera/postinstall_project/projectWithoutFaceDetection.pbxproj node_modules/react-native-camera/ios/RNCamera.xcodeproj/project.pbxproj

rn-nodeify --hack

# tmp hack to fix a bug https://github.com/react-navigation/react-navigation-stack/pull/62
cp node_modules_patches/react-navigation-stack_StackViewCard.js ./node_modules/react-navigation-stack/dist/views/StackView/StackViewCard.js
cp node_modules_patches/react-navigation-stack_StackViewCard.js ./node_modules/react-navigation-stack/src/views/StackView/StackViewCard.js

# Create the dev .env file with APP_NAME if it doesn't exist
if ! [ -f .env ]; then
  echo 'APP_NAME="LL [DEV]"' > .env;
fi

if [[ $DEBUG_RNDEBUGGER == "1" ]] ; then
  rndebugger-open
fi
