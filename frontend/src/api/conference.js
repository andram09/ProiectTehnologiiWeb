import { api } from "./axiosConfig";
export async function getAllConferences() {
  const res = await api.get("/conferences");
  return res.data;
}
export async function addConference(title, description, date, time) {
  const res = await api.post("/conferences", {
    title,
    description,
    date,
    time,
  });
  return res.data;
}
