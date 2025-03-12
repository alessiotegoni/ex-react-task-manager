import { Tasks, TasksContext, type Task } from "context/TasksProvider";
import { useContext } from "react";

export default function useTasks() {
  const context = useContext(TasksContext);

  if (!context) throw new Error();

  const setTasks = (tasks: Task[]) =>
    context.dispatch({ type: Tasks.LOAD_TASKS, payload: tasks });

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

  return { tasks: context.tasks, setTasks, addTask, updateTask, deleteTasks };
}
