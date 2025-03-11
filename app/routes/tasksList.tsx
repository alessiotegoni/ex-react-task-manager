import { api } from "utils";
import type { Route } from "./+types/tasksList";
import type { Task } from "context/TasksProvider";
import TaskRow from "components/TaskRow";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tasks" },
    { name: "description", content: "A list of your tasks" },
  ];
}

export async function loader() {
  const { data } = await api.get<Task[]>("/tasks");

  return data;
}

export default function TasksList({ loaderData: tasks }: Route.ComponentProps) {

  useEffect(() => {
    
  }, [tasks])

  return (
    <table className="w-full">
      <thead>
        <tr className="text-left">
          <th className="p-2">Name</th>
          <th className="p-2">Status</th>
          <th className="p-2">Date</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <TaskRow {...task} />
        ))}
      </tbody>
    </table>
  );
}
