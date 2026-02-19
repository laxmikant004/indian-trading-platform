import API from "./api";

export const getMarketPrice = (symbol) =>
  API.get(`/market/${symbol}`);

export const getSuggestions = (query) =>
  API.get(`/market/suggestions?query=${query}`);
