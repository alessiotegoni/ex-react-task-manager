import { tasksStatuses, type Task } from "context/TasksProvider";
import { useState, type RefObject } from "react";
import { Form } from "react-router";

export default function TaskForm(
  task: Partial<
    Task & {
      submitBtn: boolean;
      formRef: RefObject<HTMLFormElement | null>;
    }
  >
) {
  const [title, setTitle] = useState(task.title ?? "");

  return (
    <Form className="space-y-4" method="post" ref={task.formRef}>
      <div>
        <label htmlFor="title" className="block">
          Title
        </label>
        <input
          className="w-full outline-0 ring ring-amber-200 rounded-md p-2"
          type="text"
          placeholder="Title"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="description" className="block">
          Description
        </label>
        <textarea
          className="w-full outline-0 ring ring-amber-200 rounded-md p-2"
          placeholder="Description"
          id="description"
          name="description"
          defaultValue={task.description ?? ""}
        />
      </div>
      <div>
        <label htmlFor="status" className="block">
          Title
        </label>
        <select
          className="w-full outline-0 ring ring-amber-200 rounded-md p-2"
          id="status"
          name="status"
          defaultValue={task.status ?? tasksStatuses[0]}
        >
          {tasksStatuses.map((status) => (
            <option value={status}>{status}</option>
          ))}
        </select>
      </div>
      {task.submitBtn && (
        <button type="submit" className="btn bg-violet-600">
          Send
        </button>
      )}
    </Form>
  );
}
