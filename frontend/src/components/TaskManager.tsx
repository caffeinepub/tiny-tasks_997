import { useState, useMemo } from "react";
import { Plus, Search, SortAsc } from "lucide-react";
import { useGetTasks } from "../hooks/useQueries";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import type { Task } from "../backend";

type SortOption = "dueDate" | "priority" | "title";

export default function TaskManager() {
  const { data: tasks = [] } = useGetTasks();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("dueDate");
  const [showCompleted, setShowCompleted] = useState(true);

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const getPriorityOrder = (priority: string): number => {
      const priorityStr = priority.toLowerCase();
      switch (priorityStr) {
        case "high":
          return 0;
        case "medium":
          return 1;
        case "low":
          return 2;
        default:
          return 1; // default to medium
      }
    };

    const sortTasks = (taskList: Task[]) => {
      return [...taskList].sort((a, b) => {
        switch (sortBy) {
          case "dueDate":
            if (
              (a.dueDate == null || a.dueDate === 0n) &&
              (b.dueDate == null || b.dueDate === 0n)
            )
              return 0;
            if (a.dueDate == null || a.dueDate === 0n) return 1;
            if (b.dueDate == null || b.dueDate === 0n) return -1;
            return Number(a.dueDate) - Number(b.dueDate);
          case "priority":
            return getPriorityOrder(a.priority) - getPriorityOrder(b.priority);
          case "title":
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
    };

    const uncompleted = sortTasks(filtered.filter((task) => !task.completed));
    const completed = sortTasks(filtered.filter((task) => task.completed));

    return { uncompleted, completed };
  }, [tasks, searchTerm, sortBy]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </button>

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="dueDate">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>

      {showCreateForm && (
        <div className="mb-6">
          <TaskForm onClose={() => setShowCreateForm(false)} />
        </div>
      )}

      <TaskList
        uncompletedTasks={filteredAndSortedTasks.uncompleted}
        completedTasks={filteredAndSortedTasks.completed}
        showCompleted={showCompleted}
        onToggleCompleted={() => setShowCompleted(!showCompleted)}
      />
    </div>
  );
}
