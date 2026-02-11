import API from "./api";

export const addToWatchlist = (data) =>
  API.post("/watchlist", data);

export const getWatchlist = () =>
  API.get("/watchlist");

export const removeFromWatchlist = (symbol) =>
  API.delete(`/watchlist/${symbol}`);
