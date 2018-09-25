// @flow

import React, { PureComponent, Fragment } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { View, StyleSheet, Dimensions } from "react-native";
import { translate } from "react-i18next";

import type { Unit } from "@ledgerhq/live-common/lib/types";

import type { Summary } from "./provideSummary";

import colors from "../colors";

import { setSelectedTimeRange } from "../actions/settings";

import Delta from "./Delta";
import FormatDate from "./FormatDate";
import Graph from "./Graph";
import Pills from "./Pills";
import Card from "./Card";
import LText from "./LText";
import CurrencyUnitValue from "./CurrencyUnitValue";
import { getElevationStyle } from "./ElevatedView";

import type { Item } from "./Graph";
import type { T } from "../types/common";

const mapDispatchToProps = {
  setSelectedTimeRange,
};

type Props = {
  t: T,
  summary: Summary,
  setSelectedTimeRange: string => void,
  useCounterValue?: boolean,
  renderTitle?: ({ counterValueUnit: Unit, item: Item }) => React$Node,
};

type State = {
  hoveredItem: ?Item,
};

class GraphCard extends PureComponent<Props, State> {
  state = {
    hoveredItem: null,
  };

  timeRangeItems = [
    { key: "week", label: this.props.t("common:time.week") },
    { key: "month", label: this.props.t("common:time.month") },
    { key: "year", label: this.props.t("common:time.year") },
  ];

  onTimeRangeChange = item => this.props.setSelectedTimeRange(item.key);

  onItemHover = hoveredItem => this.setState({ hoveredItem });

  render() {
    const { summary, renderTitle, useCounterValue } = this.props;

    const {
      accounts,
      balanceHistory,
      balanceStart,
      balanceEnd,
      selectedTimeRange,
      counterValueCurrency,
    } = summary;

    const { hoveredItem } = this.state;

    const graphColor =
      accounts.length === 1 ? accounts[0].currency.color : undefined;

    return (
      <Card style={[getElevationStyle(4), styles.root]}>
        <GraphCardHeader
          from={balanceStart}
          to={balanceEnd}
          hoveredItem={hoveredItem}
          unit={counterValueCurrency.units[0]}
          renderTitle={renderTitle}
        />
        <Graph
          isInteractive
          height={100}
          width={Dimensions.get("window").width - 40}
          color={graphColor}
          data={balanceHistory}
          onItemHover={this.onItemHover}
          useCounterValue={useCounterValue}
        />
        <View style={styles.pillsContainer}>
          <Pills
            value={selectedTimeRange}
            onChange={this.onTimeRangeChange}
            items={this.timeRangeItems}
          />
        </View>
      </Card>
    );
  }
}

class GraphCardHeader extends PureComponent<{
  from: Item,
  to: Item,
  unit: Unit,
  hoveredItem: ?Item,
  renderTitle?: ({ counterValueUnit: Unit, item: Item }) => React$Node,
}> {
  render() {
    const { unit, from, to, hoveredItem, renderTitle } = this.props;
    const item = hoveredItem || to;
    return (
      <Fragment>
        <View style={styles.balanceTextContainer}>
          {renderTitle ? (
            renderTitle({ counterValueUnit: unit, item })
          ) : (
            <LText style={styles.balanceText}>
              <CurrencyUnitValue unit={unit} value={item.value} />
            </LText>
          )}
        </View>
        <View style={styles.subtitleContainer}>
          {hoveredItem ? (
            <LText>
              <FormatDate date={hoveredItem.date} format="MMMM D, YYYY" />
            </LText>
          ) : (
            <Fragment>
              <Delta
                percent
                from={from.value}
                to={to.value}
                style={styles.deltaPercent}
              />
              <Delta from={from.value} to={to.value} unit={unit} />
            </Fragment>
          )}
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    paddingVertical: 16,
    margin: 20,
  },
  balanceTextContainer: {
    marginBottom: 5,
    alignItems: "center",
  },
  balanceText: {
    fontSize: 22,
    color: colors.darkBlue,
  },
  subtitleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  pillsContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  deltaPercent: {
    marginRight: 20,
  },
});

export default compose(
  connect(
    null,
    mapDispatchToProps,
  ),
  translate(),
)(GraphCard);
