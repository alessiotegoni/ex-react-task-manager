import { Tasks, TasksContext, type Task } from "context/TasksProvider";
import { useContext } from "react";

export default function useTasks() {
  const context = useContext(TasksContext);

  if (!context) throw new Error();

  const setTasks = (tasks: Task[]) =>
    context.dispatch({ type: Tasks.LOAD_TASKS, payload: tasks });

  return { setTasks };
}
