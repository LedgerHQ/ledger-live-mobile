import React from "react";
import { useSelector } from "react-redux";
import { Currency } from "@ledgerhq/live-common/lib/types";
import { Portfolio } from "@ledgerhq/live-common/lib/portfolio/v2/types";
import { currenciesSelector } from "../../reducers/accounts";
import CurrencyDownStatusAlert from "../../components/CurrencyDownStatusAlert";
import GraphCard from "../../components/GraphCard";

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
      <CurrencyDownStatusAlert currencies={currencies} />

      {showGraphCard && (
<<<<<<< HEAD
        <GraphCard
          counterValueCurrency={counterValueCurrency}
          portfolio={portfolio}
        />
=======
        <Box mt={7}>
          <GraphCard
            counterValueCurrency={counterValueCurrency}
            portfolio={portfolio}
            onAnalytics={onAnalytics}
          />
        </Box>
>>>>>>> be491240839798fb07e612a99b073d6dea6d1bbe
      )}
    </>
  );
};

export default GraphCardContainer;
