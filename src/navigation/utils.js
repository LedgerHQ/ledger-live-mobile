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
        return;
      }

      // this handles ScrollView
      if (typeof ref.current.scrollTo === "function") {
        ref.current.scrollTo();
        return;
      }

      // this handles FlatList
      if (typeof ref.current.scrollToOffset === "function") {
        ref.current.scrollToOffset({ offset: 0 });
        return;
      }

      // this handles SectionList
      if (typeof ref.current.scrollToLocation === "function") {
        scrollSectionListToTop(ref.current);
        return;
      }

      // this handles SectionList with Animated wrapper
      if (
        typeof ref.current.getNode === "function" &&
        typeof ref.current.getNode().scrollToLocation === "function"
      ) {
        scrollSectionListToTop(ref.current.getNode());
      }
    });

    return () => subscription.unsubscribe();
  }, [isFocused, ref]);
}

function scrollSectionListToTop(compRef: React$Node): void {
  compRef.scrollToLocation({
    itemIndex: 0,
    sectionIndex: 0,
    viewPosition: 1,
  });
}
