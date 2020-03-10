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

      // if (somehow access to FlatList which is wrapped by Animated and used in Portfolio) {
      //  scrollToTop()
      // }
    });

    return () => subscription.unsubscribe();
  }, [isFocused, ref]);
}
