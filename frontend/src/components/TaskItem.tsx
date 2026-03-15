import { useState } from "react";
import {
  Edit3,
  ChevronDown,
  ChevronRight,
  Calendar,
  FileText,
} from "lucide-react";
import { useUpdateTask } from "../hooks/useQueries";
import TaskForm from "./TaskForm";
import type { Task } from "../backend";

interface TaskItemProps {
  task: Task;
}

type PriorityKey = "high" | "medium" | "low";

export default function TaskItem({ task }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const updateTaskMutation = useUpdateTask();

  const priorityColors = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    low: "bg-blue-100 text-blue-800 border-blue-200",
  };

  const getPriorityName = (priority: string): PriorityKey => {
    const priorityStr = priority.toLowerCase();

    if (
      priorityStr === "high" ||
      priorityStr === "medium" ||
      priorityStr === "low"
    ) {
      return priorityStr as PriorityKey;
    }

    return "medium";
  };

  const priorityName = getPriorityName(task.priority);

  const hasNotes = task.notes != null && task.notes.trim().length > 0;
  const dueDate =
    task.dueDate != null && task.dueDate !== 0n
      ? new Date(Number(task.dueDate) / 1000000)
      : null;

  const handleToggleComplete = async () => {
    await updateTaskMutation.mutateAsync({
      id: task.id,
      title: task.title,
      dueDate: task.dueDate ?? null,
      priority: task.priority,
      notes: task.notes || null,
      completed: !task.completed,
    });
  };

  const isOverdue =
    dueDate &&
    !task.completed &&
    (() => {
      const today = new Date();
      const todayDateString =
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(today.getDate()).padStart(2, "0");

      const dueDateString =
        dueDate.getFullYear() +
        "-" +
        String(dueDate.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(dueDate.getDate()).padStart(2, "0");

      return dueDateString < todayDateString;
    })();

  return (
    <div
      className={`border rounded-lg p-4 transition-all ${
        task.completed
          ? "bg-gray-50 border-gray-200 opacity-75"
          : "bg-white border-gray-200 hover:shadow-md"
      }`}
    >
      {isEditing ? (
        <TaskForm task={task} onClose={() => setIsEditing(false)} />
      ) : (
        <>
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggleComplete}
              disabled={updateTaskMutation.isPending}
              className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4
                  className={`text-lg font-medium ${
                    task.completed
                      ? "line-through text-gray-500"
                      : "text-gray-800"
                  }`}
                >
                  {task.title}
                </h4>

                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded shrink-0"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center flex-wrap gap-2 mt-2 text-sm">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full border shrink-0 ${
                    priorityColors[priorityName]
                  }`}
                >
                  {priorityName.charAt(0).toUpperCase() + priorityName.slice(1)}
                </span>

                {dueDate && (
                  <div
                    className={`flex items-center text-gray-500 ${
                      isOverdue === true ? "text-red-600 font-medium" : ""
                    }`}
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    {dueDate.toLocaleDateString()}
                    {isOverdue === true && " (Overdue)"}
                  </div>
                )}

                {hasNotes === true && (
                  <button
                    onClick={() => setShowNotes(!showNotes)}
                    className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showNotes ? (
                      <ChevronDown className="w-4 h-4 mr-1" />
                    ) : (
                      <ChevronRight className="w-4 h-4 mr-1" />
                    )}
                    <FileText className="w-4 h-4 mr-1" />
                    Notes
                  </button>
                )}
              </div>

              {showNotes === true && hasNotes === true && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {task.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
