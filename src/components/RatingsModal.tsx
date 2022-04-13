import React, { useState, useCallback } from "react";
import { Flex, Text, Button } from "@ledgerhq/native-ui";
import { WebView } from "react-native-webview";
import InAppReview from 'react-native-in-app-review';
import BottomModal from "./BottomModal";

const RatingsModal = () => {
  const [isOpened, setIsOpened] = useState(true);
  const onClose = useCallback(() => {
    setIsOpened(false);
  }, [setIsOpened]);

  const onRate = useCallback(() => {
    const isRatingAvailable = InAppReview.isAvailable();
    console.log("Rating", isRatingAvailable);
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
