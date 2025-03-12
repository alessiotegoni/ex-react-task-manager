import { createContext, useReducer, type ReactNode } from "react";

export type Task = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
};

export const tasksStatuses = ["To do", "Doing", "Done"] as const;
export type TaskStatus = (typeof tasksStatuses)[number];

export enum Tasks {
  LOAD_TASKS,
  ADD_TASK,
  REMOVE_TASK,
  UPDATE_TASK,
  REMOVE_TASKS,
}

type State = {
  tasks: Task[];
};

type Action =
  | { type: Tasks.LOAD_TASKS; payload: Task[] }
  | {
      type: Tasks.ADD_TASK;
      payload: Task;
    }
  | { type: Tasks.UPDATE_TASK; payload: Task }
  | { type: Tasks.REMOVE_TASK; payload: { id: number } }
  | { type: Tasks.REMOVE_TASKS; payload: { ids: number[] } };

interface TasksContextValues {
  tasks: Task[];
  dispatch: React.ActionDispatch<[action: Action]>;
}

export const TasksContext = createContext<TasksContextValues | null>(null);

const initialState: State = {
  tasks: [],
};

function tasksReducer(state: State, { type, payload }: Action): State {
  switch (type) {
    case Tasks.LOAD_TASKS:
      return { ...state, tasks: payload };
    case Tasks.ADD_TASK:
      return { ...state, tasks: [...state.tasks, payload] };
    case Tasks.UPDATE_TASK:
      const taskIndex = state.tasks.findIndex((task) => task.id === payload.id);
      if (taskIndex === -1) return state;

      return { ...state, tasks: state.tasks.with(taskIndex, payload) };
    case Tasks.REMOVE_TASKS:
      return {
        ...state,
        tasks: state.tasks.filter((task) => !payload.ids.includes(task.id)),
      };
    default:
      return state;
  }
}

export default function TasksProvider({ children }: { children: ReactNode }) {
  const [{ tasks }, dispatch] = useReducer(tasksReducer, initialState);

  return (
    <TasksContext.Provider value={{ tasks, dispatch }}>
      {children}
    </TasksContext.Provider>
  );
}
