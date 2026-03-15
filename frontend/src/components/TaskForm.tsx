import { useState } from "react";
import { Save, X } from "lucide-react";
import { useCreateTask, useUpdateTask } from "../hooks/useQueries";
import type { Task } from "../backend";

interface TaskFormProps {
  task?: Task;
  onClose: () => void;
}

type PriorityKey = "high" | "medium" | "low";

export default function TaskForm({ task, onClose }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [dueDate, setDueDate] = useState(
    task?.dueDate != null && task.dueDate !== 0n
      ? (() => {
          const date = new Date(Number(task.dueDate) / 1000000);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        })()
      : "",
  );
  const [priority, setPriority] = useState<PriorityKey>(() => {
    if (task?.priority) {
      const priorityStr = task.priority.toLowerCase();

      if (
        priorityStr === "high" ||
        priorityStr === "medium" ||
        priorityStr === "low"
      ) {
        return priorityStr as PriorityKey;
      }
    }
    return "medium";
  });
  const [notes, setNotes] = useState(task?.notes || "");
  const [errors, setErrors] = useState<{ title?: string }>({});

  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();

  const validateForm = () => {
    const newErrors: { title?: string } = {};
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const dueDateNanos = dueDate
      ? (() => {
          const [year, month, day] = dueDate.split("-").map(Number);
          const localDate = new Date(year, month - 1, day, 0, 0, 0, 0);
          return BigInt(localDate.getTime() * 1000000);
        })()
      : null;
    const priorityValue = priority;
    const notesValue = notes.trim() || null;

    try {
      if (task) {
        await updateTaskMutation.mutateAsync({
          id: task.id,
          title: title.trim(),
          dueDate: dueDateNanos,
          priority: priorityValue,
          notes: notesValue,
          completed: task.completed,
        });
      } else {
        await createTaskMutation.mutateAsync({
          title: title.trim(),
          dueDate: dueDateNanos,
          priority: priorityValue,
          notes: notesValue,
        });
      }
      onClose();
    } catch (error) {
      // Handle error silently or with user feedback
    }
  };

  const isLoading =
    createTaskMutation.isPending || updateTaskMutation.isPending;

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        {task ? "Edit Task" : "Create New Task"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.title ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Enter task title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => {
                const newPriority = e.target.value as PriorityKey;
                setPriority(newPriority);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Add any additional notes..."
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 mr-2 inline" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {task ? "Update" : "Create"} Task
          </button>
        </div>
      </form>
    </div>
  );
}
