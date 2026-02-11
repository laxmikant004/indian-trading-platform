import API from "./api";

// BUY
export const buyStock = (data) => {
  return API.post("/trade/buy", data);
};

// SELL
export const sellStock = (data) => {
  return API.post("/trade/sell", data);
};
