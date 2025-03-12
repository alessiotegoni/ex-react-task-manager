import { Tasks, TasksContext, type Task } from "context/TasksProvider";
import { useContext, useEffect } from "react";

export default function useTasks(tasks?: Task[]) {
  const context = useContext(TasksContext);

  if (!context) throw new Error("useTasks must used within TaskProvider");

  useEffect(() => {
    if (tasks) context.dispatch({ type: Tasks.LOAD_TASKS, payload: tasks });
  }, [tasks]);

  const addTask = (task: Task) =>
    context.dispatch({ type: Tasks.ADD_TASK, payload: task });

  const deleteTasks = (ids: number[]) => {
    if (!ids.length) return;

    context.dispatch({
      type: Tasks.REMOVE_TASKS,
      payload: { ids },
    });
  };

  const updateTask = (task: Task) => {
    context.dispatch({
      type: Tasks.UPDATE_TASK,
      payload: task,
    });
  };

  return { tasks: context.tasks, addTask, updateTask, deleteTasks };
}
