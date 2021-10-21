import React, { useMemo, useRef } from "react";
import { StyleSheet, FlatList } from "react-native";
import { useSelector } from "react-redux";
import Animated from "react-native-reanimated";
import { createNativeWrapper } from "react-native-gesture-handler";
import Chart from "./Chart";
import { accountsSelector } from "../../reducers/accounts";
import FabActions from "../../components/FabActions";
import InfoTable from "./InfoTable";
import globalSyncRefreshControl from "../../components/globalSyncRefreshControl";
import { useScrollToTop } from "../../navigation/utils";
import { MarketClient } from "../../api/market";

type Props = {
  navigation: any,
  route: any
};

const AnimatedFlatListWithRefreshControl = createNativeWrapper(
  Animated.createAnimatedComponent(globalSyncRefreshControl(FlatList)),
  {
    disallowInterruption: true,
    shouldCancelWhenOutside: false,
  },
);

export default function SymbolDashboard({ route }: Props) {
  const { currencyOrToken } = route.params;
  console.log("currencyOrToken = ", currencyOrToken);
  const accounts = useSelector(accountsSelector);
  const scrollY = useRef(new Animated.Value(0)).current;

  const ref = useRef();
  useScrollToTop(ref);

  // CHECK SUPPORTED COINS
  // const cryptoCurrencies = useMemo(
  //   () => listSupportedCurrencies().concat(listTokens()),
  //   [],
  // );

  const data = useMemo(
    () => [
      <Chart />,
      <FabActions />,
      <InfoTable />,
      <InfoTable />,
      <InfoTable />,
    ],
    [],
  );
  return (
    <AnimatedFlatListWithRefreshControl
      ref={ref}
      data={data}
      style={styles.inner}
      renderItem={({ item }) => item}
      keyExtractor={(item, index) => String(index)}
      showsVerticalScrollIndicator={false}
      onScroll={Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: { y: scrollY },
            },
          },
        ],
        { useNativeDriver: true },
      )}
      testID={
        accounts.length ? "PortfolioAccountsList" : "PortfolioEmptyAccount"
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    backgroundColor: "#fff",
  },
  stickyActions: {
    height: 40,
    width: "100%",
    alignContent: "flex-start",
    justifyContent: "flex-start",
  },
  styckyActionsInner: { height: 56 },
});
