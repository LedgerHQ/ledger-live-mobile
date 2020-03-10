import { useEffect } from "react";
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

      ref.current.scrollTo();
    });

    return () => subscription.unsubscribe();
  }, [isFocused, ref]);
}
