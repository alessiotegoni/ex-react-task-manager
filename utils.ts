import axios from "axios";
import { tasksStatuses, type TaskStatus } from "context/TasksProvider";
import dayjs from "dayjs";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const formatDate = (isoDate: string) =>
  dayjs(isoDate).format("DD/MM/YYYY");

export const getStatusColor = (status: TaskStatus) =>
  status === "To do"
    ? "bg-red-400"
    : status === "Doing"
    ? "bg-yellow-400"
    : "bg-green-400";

export const validateTask = (formData: FormData) => {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as TaskStatus;

  const forbiddenSymbolsRegex = /[!@#$%^&*()\-=+\[\]{}|;:'",.<>?/`~]/;

  if (
    !title ||
    forbiddenSymbolsRegex.test(title) ||
    !description ||
    !tasksStatuses.includes(status)
  )
    return {
      success: false,
      message:
        "Riempi tutti i campi e assicurati che il titolo non abbia caratteri speciali",
    };

  return { success: true, data: { title, description, status } };
};
