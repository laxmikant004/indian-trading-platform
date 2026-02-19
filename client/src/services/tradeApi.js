import API from "./api";

export const buyStock = (data) => API.post("/trade/buy", data);
export const sellStock = (data) => API.post("/trade/sell", data);
export const getTradeHistory = () => API.get("/trade/history");
export const getPortfolio = () => API.get("/trade/portfolio");
