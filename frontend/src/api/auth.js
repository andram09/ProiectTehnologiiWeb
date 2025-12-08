import axios from "axios";
import { api } from "./axiosConfig.js";
export async function loginRequest(email, password) {
  const response = await api.post(`/login`, {
    email,
    password,
  });
  if (!response.data.user) {
    throw new Error("Invalid credentials");
  }
  return {
    token: response.data.token,
    user: response.data.user,
  };
}

export async function registerRequest(userData) {
  const response = await api.post("/register", userData);
  return response.data;
}
