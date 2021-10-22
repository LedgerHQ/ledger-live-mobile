import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Delta from "../../components/Delta";
import { normalize } from "../../helpers/normalizeSize";

type Row = {
  title: string,
  info: string,
  additionalInfo?: any,
  date?: string,
};

type Props = {
  title: string,
  rows: Array<Row>,
};

export default function InfoTable({ title, rows }: Props) {
  return (
    <>
      {rows.length ? (
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          {rows.map((item, index) => (
            <View
              style={[styles.row, rows.length - 1 === index && styles.lastRow]}
              key={item.title}
            >
              <Text style={styles.rowTitle}>{item.title}</Text>
              <View style={styles.info}>
                <Text style={styles.infoText}>{item.info}</Text>
                {item.additionalInfo ? (
                  <Delta
                    percent
                    valueChange={item.additionalInfo}
                    textStyle={styles.deltaPercent}
                    toFixed={2}
                  />
                ) : null}
                {item.date ? (
                  <Text style={styles.date}>{item.date}</Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </>
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
