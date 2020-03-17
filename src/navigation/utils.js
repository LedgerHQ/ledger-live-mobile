import { useEffect } from "react";
import { ScrollView } from "react-native";
import { Subject } from "rxjs/Subject";
import {
  useIsFocused,
  useScrollToTop as useNativeScrollToTop,
} from "@react-navigation/native";

export const headerPressSubject = new Subject();

export function useScrollToTop(
  ref: React.MutableRefObject<ScrollView | undefined>,
) {
  const isFocused = useIsFocused();

  useNativeScrollToTop(ref);

  useEffect(() => {
    const subscription = headerPressSubject.subscribe(() => {
      if (!ref.current || !isFocused) {
        return subscription.unsubscribe();
      }

      if (typeof ref.current.scrollTo === "function") {
        // this handles ScrollView
        ref.current.scrollTo();
      } else if (typeof ref.current.scrollToOffset === "function") {
        // this handles FlatList
        ref.current.scrollToOffset({ offset: 0 });
      } else if (typeof ref.current.scrollToLocation === "function") {
        // this handles SectionList
        scrollSectionListToTop(ref.current);
      } else if (
        typeof ref.current.getNode === "function" &&
        typeof ref.current.getNode().scrollToLocation === "function"
      ) {
        // this handles SectionList with Animated wrapper
        scrollSectionListToTop(ref.current.getNode());
      }

      return subscription.unsubscribe();
    });
  }, [isFocused, ref]);
}

function scrollSectionListToTop(compRef: React$Node): void {
  compRef.scrollToLocation({
    itemIndex: 0,
    sectionIndex: 0,
    // Set big enough offset umber for unfixed header hight
    viewOffset: 1000,
  });
}
