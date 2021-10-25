export const currencyFormat = (num, cur) =>
  num ? cur + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") : "";
