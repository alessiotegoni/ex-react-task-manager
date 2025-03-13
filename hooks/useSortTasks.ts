import { useMemo, useState, useCallback } from "react";
import dayjs from "dayjs";
import useTasks from "./useTasks";

type SortBy = "title" | "status" | "createdAt";

function debounce(fn: Function, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return (search: string) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(search), delay);
  };
}

export default function useSortTasks() {
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<1 | -1>(1);
  const [search, setSearch] = useState("");

  const { tasks } = useTasks();

  const sortedTasks = useMemo(
    () =>
      tasks?.toSorted((a, b) => {
        let comparison = 0;

        if (sortBy === "title" || sortBy === "status") {
          comparison = a[sortBy].localeCompare(b[sortBy]);
        } else if (sortBy === "createdAt") {
          comparison = dayjs(a.createdAt).diff(dayjs(b.createdAt));
        }

        return comparison * sortOrder;
      }),
    [tasks, sortBy, sortOrder]
  );

  const filteredTasks = useMemo(
    () =>
      sortedTasks.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase())
      ),
    [sortedTasks, search]
  );

  const debouncedSetSearch = useCallback(debounce(setSearch, 300), []);

  const handleSetSortBy = (selectedSortBy: SortBy) => {
    if (selectedSortBy !== sortBy) setSortBy(selectedSortBy);

    setSortOrder(selectedSortBy === sortBy && sortOrder === -1 ? 1 : -1);
  };

  return { filteredTasks, handleSetSortBy, setSortOrder, debouncedSetSearch };
}
