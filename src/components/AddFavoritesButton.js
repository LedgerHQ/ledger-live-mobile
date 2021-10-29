// @flow

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { TouchableOpacity, StyleSheet } from "react-native";
import Star from "../icons/Star";
import { updateFavoriteCryptocurrencies } from "../actions/market";
import { getFavoriteCryptocurrenciesSelector } from "../reducers/market";

type Props = {
  cryptocurrency: Object,
};

function AddFavoritesButton({ cryptocurrency }: Props) {
  const dispatch = useDispatch();

  const favoriteCryptocurrencies = useSelector(
    getFavoriteCryptocurrenciesSelector,
  );

  const isFavorite = favoriteCryptocurrencies.includes(cryptocurrency.id);

  const addToFavorites = () => {
    if (isFavorite) {
      dispatch(
        updateFavoriteCryptocurrencies(
          favoriteCryptocurrencies.filter(fc => fc !== cryptocurrency.id),
        ),
      );
    } else {
      dispatch(
        updateFavoriteCryptocurrencies([
          ...favoriteCryptocurrencies,
          cryptocurrency.id,
        ]),
      );
    }
  };

  return (
    <TouchableOpacity onPress={addToFavorites} style={styles.button}>
      <Star
        fill={isFavorite ? "#F5BC00" : null}
        stroke={isFavorite ? "#F5BC00" : "#142533"}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 13,
  },
});

export default AddFavoritesButton;
