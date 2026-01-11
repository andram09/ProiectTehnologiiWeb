import axios from "axios";
export const api = axios.create({
  baseURL: "https://proiect-tehnologiiweb-conferinte.azurewebsites.net/api",
  withCredentials: true,
});
