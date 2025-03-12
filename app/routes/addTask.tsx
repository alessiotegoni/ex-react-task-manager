import TaskForm from "components/TaskForm";
import type { Route } from "./+types/addTask";
import {
  tasksStatuses,
  type Task,
  type TaskStatus,
} from "context/TasksProvider";
import { api, validateTask } from "utils";
import { use, useEffect } from "react";
import useTasks from "hooks/useTasks";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Add Tasks" },
    { name: "description", content: "Add a task" },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const validation = validateTask(formData);

  if (!validation.success) return { ...validation };

  const { data } = await api.post<{
    success: boolean;
    message?: string;
    task: Task;
  }>("/tasks", validation.data);

  return {
    success: data.success,
    message: data.message ?? "",
    task: data.task,
  };
}

export default function AddTask({ actionData }: Route.ComponentProps) {
  const { addTask } = useTasks();
  const navigate = useNavigate();

  useEffect(() => {
    if (actionData?.success) {
      addTask(actionData.task!);
      navigate("/");
    }
  }, [actionData]);

  return (
    <section className="mx-auto max-w-md">
      <h2 className="text-xl font-semibold mb-4">Add a task</h2>
      {actionData && !actionData.success && (
        <p className="text-red-500">{actionData.message}</p>
      )}
      <TaskForm submitBtn={true} />
    </section>
  );
}
