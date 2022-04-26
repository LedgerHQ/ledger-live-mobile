import React, { useState, useCallback } from "react";
import { Flex, Text, Button } from "@ledgerhq/native-ui";
import { Linking, Platform } from "react-native";
import { WebView } from "react-native-webview";
import InAppReview from "react-native-in-app-review";
import BottomModal from "./BottomModal";
import { urls } from "../config/urls";

const injectedJavaScript = `
window.activeObserver = null;
window.addEventListener('message', (event) => {
  window.ReactNativeWebView.postMessage(event.data);
});
window.addEventListener('load', () => {
  window.ReactNativeWebView.postMessage('form-ready');      
  setObserver(document.querySelector('div[data-qa-focused="true"]')); 
});
function checkSubmit() {
  const submitButton = document.querySelector('button[data-qa*="submit-button"]');
  if (submitButton) {
    submitButton.addEventListener('click', () => {
      window.ReactNativeWebView.postMessage('form-submit');
    });
  }
}
function onScreenChange() {
  window.ReactNativeWebView.postMessage('form-screen-changed');
  activeObserver.disconnect();
  setObserver(document.querySelector('div[data-qa-focused="true"]'));
  checkSubmit();
}
function setObserver(element) {
  activeObserver = new MutationObserver(onScreenChange);
  const config = { attributes: true };
  activeObserver.observe(element, config);
}

true;
`;

const runFirst = `
setTimeout(function() {
  const submitButton = document.querySelector('button[data-qa*="submit-button"]');
  submitButton.addEventListener('click', () => {
    window.ReactNativeWebView.postMessage('form-submit');
  });
}, 100);

true;
`;

const RatingsModal = () => {
  const [isOpened, setIsOpened] = useState(true);
  const onClose = useCallback(() => {
    setIsOpened(false);
  }, [setIsOpened]);

  const goToStore = useCallback(() => {
    Linking.openURL(
      Platform.OS === "ios"
        ? "https://apps.apple.com/app/id1361671700?action=write-review"
        : urls.playstore,
    );
  }, []);

  const onMessage = useCallback(event => {
    // const { data } = event.nativeEvent;
    console.log("onMessage: ", event.nativeEvent.data);
  }, []);

  const requestInAppReview = useCallback(async () => {
    try {
      const isRatingAvailable = InAppReview.isAvailable();
      console.log("Rating", isRatingAvailable);
      const hasFlowFinishedSuccessfully = await InAppReview.RequestInAppReview();

      // when return true in android it means user finished or close review flow
      console.log("InAppReview in android", hasFlowFinishedSuccessfully);

      // when return true in ios it means review flow lanuched to user.
      console.log(
        "InAppReview in ios has launched successfully",
        hasFlowFinishedSuccessfully,
      );

      // 1- you have option to do something ex: (navigate Home page) (in android).
      // 2- you have option to do something,
      // ex: (save date today to lanuch InAppReview after 15 days) (in android and ios).

      // 3- another option:
      if (hasFlowFinishedSuccessfully) {
        // do something for ios
        // do something for android
      }

      // for android:
      // The flow has finished. The API does not indicate whether the user
      // reviewed or not, or even whether the review dialog was shown. Thus, no
      // matter the result, we continue our app flow.

      // for ios
      // the flow lanuched successfully, The API does not indicate whether the user
      // reviewed or not, or he/she closed flow yet as android, Thus, no
      // matter the result, we continue our app flow.
    } catch (error) {
      // we continue our app flow.
      // we have some error could happen while lanuching InAppReview,
      // Check table for errors and code number that can return in catch.
      console.log(error);
    }
  }, []);

  console.log("Hello Ratings Modal");
  return (
    <BottomModal
      id="RatingsModal"
      isOpened={true} // isOpened
      onClose={onClose}
      // preventBackdropClick
    >
      <Flex style={{ height: "100%" }}>
        <Text
          variant="h2"
          fontWeight="semiBold"
          color="neutral.c100"
          textAlign="center"
        >
          Typeform
        </Text>
        <WebView
          source={{
            uri: encodeURI(
              "https://form.typeform.com/to/Jo7gqcB4?typeform-medium=embed-sdk&typeform-medium-version=next&typeform-embed=popup-blank",
            ),
          }}
          originWhitelist={["*"]}
          javaScriptEnabledAndroid={true}
          injectedJavaScript={runFirst}
          onLoadEnd={(message: any) =>
            console.log(
              "ON LOAD",
              message.nativeEvent.data,
              message.nativeEvent,
            )
          }
          onMessage={onMessage}
        />
        <Button type="color" onPress={goToStore}>
          Rate
        </Button>
      </Flex>
    </BottomModal>
  );
};

export default RatingsModal;
