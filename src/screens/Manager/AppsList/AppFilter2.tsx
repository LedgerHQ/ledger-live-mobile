/*
import React, { memo, useState, useCallback } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { Icons, Box } from "@ledgerhq/native-ui";

import FilterModalComponent from "../Modals/FilterModal";

type Props = {
  filter: string,
  setFilter: (filter: string) => void,
  sort: string,
  setSort: (sort: string) => void,
  order: string,
  setOrder: (order: string) => void,
  disabled: boolean,
};

const AppFilter = ({
  filter,
  setFilter,
  sort,
  setSort,
  order,
  setOrder,
  disabled,
}: Props) => {
  const [isOpened, setOpenModal] = useState(false);
  const openModal = useCallback(() => setOpenModal(true), [setOpenModal]);
  const closeModal = useCallback(() => setOpenModal(false), [setOpenModal]);

  /*
  <View>
        <Button
          containerStyle={styles.searchBarFilters}
          type="darkSecondary"
          IconLeft={Filters}
          onPress={openModal}
          disabled={disabled}
          useTouchable
          event="ManagerAppFilterOpenModal"
        />
        {filter !== "all" && <NotifBadge />}
      </View>
  
  return (
    <>
      <TouchableOpacity disabled={disabled} onPress={openModal}>
        <Box style={[styles.filterButton]} borderColor="error.c100">
          <Icons.TrashMedium size={18} color="error.c100"/>
        </Box>
      </TouchableOpacity>
      <FilterModalComponent
        isOpened={isOpened}
        filter={filter}
        setFilter={setFilter}
        sort={sort}
        setSort={setSort}
        order={order}
        setOrder={setOrder}
        onClose={closeModal}
      />
    </>
  );
};

AppFilter.defaultProps = {
  filters: [],
};

const styles = StyleSheet.create({
  filterButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default memo(AppFilter);
*/