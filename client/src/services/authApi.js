import API from "./api";



export const getProfile = () => API.get("/auth/profile");
export const loginUser = (data) => {
  return API.post("/auth/login", data);
};

export const registerUser = (data) => {
  return API.post("/auth/register", data);
};
