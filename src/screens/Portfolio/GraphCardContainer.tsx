import React from "react";
import { useSelector } from "react-redux";
import { Currency } from "@ledgerhq/live-common/lib/types";
import { Portfolio } from "@ledgerhq/live-common/lib/portfolio/v2/types";
import { Box } from "@ledgerhq/native-ui";
import { currenciesSelector } from "../../reducers/accounts";
import CurrencyDownStatusAlert from "../../components/CurrencyDownStatusAlert";
import GraphCard from "../../components/GraphCard";
import Header from "./Header";

const GraphCardContainer = ({
  portfolio,
  showGraphCard,
  counterValueCurrency,
  onAnalytics,
}: {
  portfolio: Portfolio;
  showGraphCard: boolean;
  counterValueCurrency: Currency;
  onAnalytics: Function;
}) => {
  const currencies = useSelector(currenciesSelector);

  return (
    <>
      {showGraphCard && <Header />}

      <CurrencyDownStatusAlert currencies={currencies} />

      {showGraphCard && (
        <Box mt={7}>
          <GraphCard
            counterValueCurrency={counterValueCurrency}
            portfolio={portfolio}
            onAnalytics={onAnalytics}
          />
        </Box>
      )}
    </>
  );
};

export default GraphCardContainer;
