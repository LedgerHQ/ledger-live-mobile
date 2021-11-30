// @flow

import React, { useContext } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Star from "../icons/Star";
import {
  MarketContext,
  SET_FAVORITE_CRYPTOCURRENCIES,
} from "../context/MarketContext";
import { useFavoriteCrypto } from "../hooks/market";
import { setFavoriteCurrencies as setFavoriteCurrenciesDB } from "../db";

type Props = {
  cryptocurrency: Object,
};

function AddFavoritesButton({ cryptocurrency }: Props) {
  const { contextDispatch } = useContext(MarketContext);

  const favoriteCryptocurrencies = useFavoriteCrypto();

  const isFavorite = favoriteCryptocurrencies.includes(cryptocurrency.id);

  let favorites = [];

  const addToFavorites = () => {
    if (isFavorite) {
      favorites = favoriteCryptocurrencies.filter(
        fc => fc !== cryptocurrency.id,
      );
    } else {
      favorites = [...favoriteCryptocurrencies, cryptocurrency.id];
    }
    contextDispatch(SET_FAVORITE_CRYPTOCURRENCIES, favorites);
    setFavoriteCurrenciesDB(favorites);
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
