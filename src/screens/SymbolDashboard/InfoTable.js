import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Delta from "../../components/Delta";
import { normalize } from "../../helpers/normalizeSize";

// type Row = {
//   title: string,
//   info: string,
//   additionalInfo?: any,
//   date?: string,
// };

type Props = {
  title: string,
  // rows: Array<Row>,
};

const rows = [
  {
    title: "Price",
    info: "$44,855.80",
    additionalInfo: { percentage: 7, value: 10 },
  },
  {
    title: "Trading volume (24h)",
    info: "$29,128,449,369.68",
    additionalInfo: { percentage: 7, value: 10 },
  },
  {
    title: "24h Low / 24h High",
    info: "42,822.37 / 44,313.25",
  },
  {
    title: "7d Low / 7d High",
    info: "40,544.37 / 45,167.25",
  },
  {
    title: "All time high",
    info: "$64,804.72",
    date: "April 14th, 2021",
  },
  {
    title: "All time low",
    info: "$67.81",
    date: "July 6th, 2013",
  },
];

export default function InfoTable({
  title = "Price statistics",
}: // rows = [...sections],
Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {rows.map((item, index) => (
        <View style={[styles.row, rows.length - 1 === index && styles.lastRow]}>
          <Text style={styles.rowTitle}>{item.title}</Text>
          <View style={styles.info}>
            <Text style={styles.infoText}>{item.info}</Text>
            {item.additionalInfo ? (
              <Delta
                percent
                valueChange={item.additionalInfo}
                textStyle={styles.deltaPercent}
              />
            ) : null}
            {item.date ? <Text style={styles.date}>{item.date}</Text> : null}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "rgba(245, 245, 245, .5)",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: normalize(16),
    lineHeight: normalize(18),
    fontWeight: "600",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "rgba(20, 37, 51, 0.08)",
    paddingVertical: 12,
  },
  info: {
    alignItems: "flex-end",
  },
  rowTitle: {
    color: "rgba(20, 37, 51, 0.7)",
    lineHeight: normalize(18),
    fontSize: normalize(13),
  },
  infoText: {
    fontSize: normalize(13),
    lineHeight: normalize(18),
    fontWeight: "600",
  },
  deltaPercent: {
    fontSize: normalize(13),
    lineHeight: normalize(18),
    fontWeight: "500",
  },
  date: {
    fontSize: normalize(13),
    lineHeight: normalize(18),
    fontWeight: "500",
    color: "rgba(20, 37, 51, 0.5)",
  },
  lastRow: {
    borderBottomWidth: 0,
    paddingBottom: 0,
    alignItems: "center",
  },
});
