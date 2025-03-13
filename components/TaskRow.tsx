import type { Task } from "context/TasksProvider";
import { memo } from "react";
import { Link } from "react-router";
import { formatDate, getStatusColor } from "utils";

function TaskRow({
  id,
  title,
  status,
  createdAt,
  checked,
  onToggle,
}: Task & { checked: boolean; onToggle: (taskId: number) => void }) {
  console.log(title);

  return (
    <tr>
      <td>
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onToggle(id)}
        />
        {checked && <input type="hidden" name="ids" value={id} hidden />}
      </td>
      <td className="p-2">
        <Link to={`/tasks/${id}`} className="hover:underline">
          {title}
        </Link>
      </td>
      <td className={`p-2 ${getStatusColor(status)}`}>{status}</td>
      <td className="p-2">{formatDate(createdAt)}</td>
    </tr>
  );
}

export default memo(TaskRow);
