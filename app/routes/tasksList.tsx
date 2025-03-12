import { api } from "utils";
import type { Route } from "./+types/tasksList";
import type { Task } from "context/TasksProvider";
import TaskRow from "components/TaskRow";
import { useEffect, useState } from "react";
import useTasks from "hooks/useTasks";
import { Form } from "react-router";
import useSortTasks from "hooks/useSortTasks";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tasks" },
    { name: "description", content: "A list of your tasks" },
  ];
}

export async function clientLoader() {
  const { data } = await api.get<Task[]>("/tasks");

  return data;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const ids = formData.getAll("ids");

  if (!ids.length) return;

  const promises = ids.map((id) =>
    api.delete<{ success: boolean }>(`/tasks/${id}`).then(() => id as string)
  );
  const results = await Promise.allSettled(promises);

  const successfulDeletes = results
    .filter((res) => res.status === "fulfilled")
    .map((res) => parseInt(res.value));

  const failedDeletes = results
    .filter((res) => res.status === "rejected")
    .map((res) => res.reason.id);

  return { failedDeletes, successfulDeletes };

  // const { data } = await api.delete<Task[]>("/tasks");
}

export function HydrateFallback() {
  return <div>Loading...</div>;
}

export default function TasksList({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const [selectedTasksIds, setSelectedTasksIds] = useState<number[]>([]);

  const { deleteTasks } = useTasks(loaderData);
  const { sortedTasks, handleSetSortBy } = useSortTasks();

  useEffect(() => {
    if (!actionData) return;

    deleteTasks(actionData.successfulDeletes);
    setSelectedTasksIds(
      actionData.failedDeletes.length ? actionData.failedDeletes : []
    );

    if (actionData.failedDeletes.length) {
      alert(
        `Le task con id: ${actionData.failedDeletes.join(
          ", "
        )} non sono state eliminate`
      );
      return;
    }

    alert("Task eliminate con successo");
  }, [actionData]);

  return (
    <section>
      {sortedTasks.length ? (
        <Form method="delete">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="p-2"></th>
                <th className="p-2" onClick={() => handleSetSortBy("title")}>
                  Name
                </th>
                <th className="p-2" onClick={() => handleSetSortBy("status")}>
                  Status
                </th>
                <th
                  className="p-2"
                  onClick={() => handleSetSortBy("createdAt")}
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedTasks.map((task) => {
                const isChecked = selectedTasksIds.includes(task.id);

                return (
                  <TaskRow
                    {...task}
                    checked={isChecked}
                    onToggle={() =>
                      setSelectedTasksIds(
                        isChecked
                          ? selectedTasksIds.filter((id) => id !== task.id)
                          : [...selectedTasksIds, task.id]
                      )
                    }
                  />
                );
              })}
            </tbody>
          </table>
          {!!selectedTasksIds.length && (
            <button type="submit" className="btn bg-red-500 mt-3">
              Elimina selezionate
            </button>
          )}
        </Form>
      ) : (
        <p>Non hai task</p>
      )}
    </section>
  );
}
