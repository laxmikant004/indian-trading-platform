import API from "./api";

<<<<<<< HEAD
// BUY
export const buyStock = (data) => {
  return API.post("/trade/buy", data);
};

// SELL
export const sellStock = (data) => {
  return API.post("/trade/sell", data);
};
=======
export const buyStock = (data) => API.post("/trade/buy", data);
export const sellStock = (data) => API.post("/trade/sell", data);
export const getTradeHistory = () => API.get("/trade/history");
export const getPortfolio = () => API.get("/trade/portfolio");
>>>>>>> bbb183b (Sprint 2 almost compeleted...)
