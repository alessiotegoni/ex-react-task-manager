import type { Task } from "context/TasksProvider";
import { formatDate } from "utils";

export default function TaskRow({
  id,
  title,
  description,
  status,
  createdAt,
}: Task) {
  return (
    <tr>
      <td className="p-2">{title}</td>
      <td className="p-2">{status}</td>
      <td className="p-2">{formatDate(createdAt)}</td>
    </tr>
  );
}
