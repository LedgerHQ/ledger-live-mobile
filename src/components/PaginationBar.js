import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

type Props = {
  totalPages: Number,
  activePage: Number,
  setActivePage: Number => void,
};

type PageItemProps = {
  text: String,
  onClick: () => void,
  style: Object,
};

export default function PaginationBar({
  totalPages,
  activePage,
  setActivePage,
}: Props) {
  const [page, setPage] = useState(activePage);

  const setPageNum = _page => {
    setPage(_page);
    setActivePage(_page);
  };

  const PageItem = ({ text, onClick, style }: PageItemProps) => (
    <View width={40} height={40} style={style}>
      <TouchableOpacity onPress={() => onClick()}>
        <Text style={[styles.pageItemText, { color: style.color }]}>
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const pages = Array.from(Array(totalPages + 1).keys()).slice(1);

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <PageItem
          text={"ᐸ"}
          onClick={() => {
            setPageNum(Math.max(1, page - 1));
          }}
          style={styles.pageItemLeft}
        />
        {pages.map((page, id) => {
          if (
            page === 1 ||
            page === totalPages ||
            Math.abs(page - activePage) <= 1 ||
            (activePage === 1 && page === 3) ||
            (activePage === totalPages && page === totalPages - 2)
          ) {
            return (
              <PageItem
                text={page}
                onClick={() => {
                  setPageNum(page);
                }}
                style={
                  page === activePage
                    ? styles.pageItemActive
                    : styles.pageItemUnactive
                }
                key={id}
              />
            );
          }
          if (page === 2 || page === totalPages - 1) {
            return (
              <PageItem
                text={"..."}
                onClick={() => {}}
                style={
                  page === activePage
                    ? styles.pageItemActive
                    : styles.pageItemUnactive
                }
                key={id}
              />
            );
          }
          return null;
        })}
        <PageItem
          text={"ᐳ"}
          onClick={() => {
            setPageNum(Math.min(totalPages, page + 1));
          }}
          style={styles.pageItemRight}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 50,
  },
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    paddingTop: 5,
    backgroundColor: "#f5f5f5",
    height: "100%",
    justifyContent: "space-between",
  },
  pageItemLeft: {
    left: 0,
    height: "100%",
    color: "#14253350",
  },
  pageItemRight: {
    right: 0,
    height: "100%",
    color: "#14253350",
  },
  pageItemActive: {
    color: "#f5f5f5",
    borderRadius: 50,
    backgroundColor: "#6490f1",
  },
  pageItemUnactive: {
    color: "#14253350",
  },
  pageItemText: {
    fontSize: 18,
    textAlign: "center",
    textAlignVertical: "center",
    paddingTop: 7,
  },
});
