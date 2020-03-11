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

      if (typeof ref.current.scrollTo === "function") {
        ref.current.scrollTo();
        return;
      }

      if (typeof ref.current.scrollToOffset === "function") {
        ref.current.scrollToOffset({ offset: 0 });
        return;
      }

      if (typeof ref.current.scrollToLocation === "function") {
        ref.current.scrollToLocation({
          itemIndex: 0,
          sectionIndex: 0,
          viewPosition: 1,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [isFocused, ref]);
}
