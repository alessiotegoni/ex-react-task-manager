import { useMemo, useState } from "react";
import dayjs from "dayjs";
import useTasks from "./useTasks";

type SortBy = "title" | "status" | "createdAt";

export default function useSortTasks() {
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<1 | -1>(1);

  const { tasks } = useTasks();

  const sortedTasks = useMemo(
    () =>
      tasks?.toSorted((a, b) => {
        let comparison = 0;

        if (sortBy === "title" || sortBy === "status") {
          comparison = a[sortBy].localeCompare(b[sortBy]);
        } else if (sortBy === "createdAt") {
          comparison = dayjs(a.createdAt).diff(dayjs(b.createdAt));
          //   comparison =
          //     new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }

        return comparison * sortOrder;
      }),
    [tasks, sortBy, sortOrder]
  );

  const handleSetSortBy = (selectedSortBy: SortBy) => {
    if (selectedSortBy !== sortBy) setSortBy(selectedSortBy);

    setSortOrder(selectedSortBy === sortBy && sortOrder === -1 ? 1 : -1);
  };

  return { sortedTasks, handleSetSortBy, setSortOrder };
}
