import API from "./api";

export const getPortfolio = () =>
  API.get("/portfolio");
