import { api, formatDate, getStatusColor, validateTask } from "utils";
import type { Route } from "./+types/taskDetails";
import type { Task } from "context/TasksProvider";
import Modal from "components/Modal";
import useTasks from "hooks/useTasks";
import { useFetcher, useNavigate } from "react-router";
import { useEffect, useRef } from "react";
import TaskForm from "components/TaskForm";

export async function loader({ params }: Route.ClientLoaderArgs) {
  try {
    const { data } = await api.get<Task>("/tasks/" + params.id);

    return data;
  } catch (err) {
    return;
  }
}

export async function action({ params, request }: Route.ActionArgs) {
  try {
    if (request.method === "DELETE") {
      await api.delete<{ success: boolean }>(`/tasks/${params.id}`);

      return { deleted: true };
    }
    if (request.method === "PUT") {
      const formData = await request.formData();

      const validation = validateTask(formData);
      if (!validation.success) return { ...validation };

      const { data } = await api.put<{ success: boolean; task: Task }>(
        `/tasks/${params.id}`,
        validation.data
      );

      return data.task;
    }
  } catch (err: any) {
    return { error: true, message: err.message as string };
  }
}

export default function TaskDetails({
  loaderData: task,
  params,
}: Route.ComponentProps) {
  const { updateTask, deleteTasks } = useTasks();

  const fetcher = useFetcher();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const fetcherData = fetcher.data;

    if (!fetcherData) return;

    if (fetcherData?.error) return alert(fetcherData.message);

    if (fetcherData?.deleted) {
      deleteTasks([parseInt(params.id)]);
      navigate("/");
    } else updateTask(fetcherData as Task);
  }, [fetcher.data]);

  if (!task)
    return <h2 className="text-2xl font-semibold">Task non trovato</h2>;

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold">{task.title}</h2>
        <div
          className={`${getStatusColor(task.status)} rounded-full  py-1 px-3`}
        >
          {task.status}
        </div>
      </div>
      <p className="my-4">{task.description}</p>
      <p>Creato il: {formatDate(task.createdAt)}</p>
      <div className="flex gap-3 mt-4">
        <Modal
          title="Elimina Task"
          btnClasses="bg-red-500 text-black"
          onConfirm={() =>
            fetcher.submit(
              {},
              { method: "DELETE", action: `/tasks/${task.id}` }
            )
          }
        >
          Conferma l'eliminazione della task
        </Modal>
        <Modal
          title="Modifica Task"
          btnClasses="bg-blue-500 text-black"
          onConfirm={() =>
            fetcher.submit(formRef.current, {
              action: `/tasks/${task.id}`,
              method: "PUT",
            })
          }
        >
          <TaskForm {...task} formRef={formRef} />
        </Modal>
      </div>
    </div>
  );
}
