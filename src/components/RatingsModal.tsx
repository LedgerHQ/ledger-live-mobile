import React, { useState, useCallback } from "react";
import { Flex, Text, Button } from "@ledgerhq/native-ui";
import { WebView } from "react-native-webview";
import InAppReview from "react-native-in-app-review";
import BottomModal from "./BottomModal";

const RatingsModal = () => {
  const [isOpened, setIsOpened] = useState(true);
  const onClose = useCallback(() => {
    setIsOpened(false);
  }, [setIsOpened]);

  const onRate = useCallback(async () => {
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
      <Flex m={4} style={{ height: "100%" }}>
        <Text
          variant="h2"
          fontWeight="semiBold"
          color="neutral.c100"
          textAlign="center"
        >
          Typeform
        </Text>
        <WebView
          originWhitelist={["*"]}
          source={{ uri: "https://form.typeform.com/to/Jo7gqcB4" }}
          onLoadEnd={(message: any) => console.log("ON LOAD", message)}
          onMessage={(message: any) => console.log("ON MESSAGE", message)}
        />
        <Button type="color" onPress={onRate}>
          Rate
        </Button>
      </Flex>
    </BottomModal>
  );
};

export default RatingsModal;
