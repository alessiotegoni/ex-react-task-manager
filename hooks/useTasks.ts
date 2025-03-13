import { Tasks, TasksContext, type Task } from "context/TasksProvider";
import { useCallback, useContext, useEffect } from "react";

export default function useTasks(tasks?: Task[]) {
  const context = useContext(TasksContext);

  if (!context) throw new Error("useTasks must used within TaskProvider");

  useEffect(() => {
    if (tasks?.length)
      context.dispatch({ type: Tasks.LOAD_TASKS, payload: tasks });
  }, [tasks]);

  const addTask = useCallback(
    (task: Task) => context.dispatch({ type: Tasks.ADD_TASK, payload: task }),
    [context]
  );

  const updateTask = useCallback(
    (task: Task) =>
      context.dispatch({ type: Tasks.UPDATE_TASK, payload: task }),
    [context]
  );

  const deleteTasks = useCallback(
    (ids: number[]) => {
      if (!ids.length) return;
      context.dispatch({ type: Tasks.REMOVE_TASKS, payload: { ids } });
    },
    [context]
  );

  return { tasks: context.tasks, addTask, updateTask, deleteTasks };
}
