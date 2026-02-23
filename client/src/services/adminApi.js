import API from "./api";

export const getAdminStats = () => API.get("/admin/stats");
export const getAllUsers = () => API.get("/admin/users");
export const getAllOrders = () => API.get("/admin/orders");
export const getAllTrades = () => API.get("/admin/trades");