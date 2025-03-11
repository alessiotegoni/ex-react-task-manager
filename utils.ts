import axios from "axios";
import dayjs from "dayjs";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const formatDate = (isoDate: string) =>
  dayjs(isoDate).format("DD/MM/YYYY");
