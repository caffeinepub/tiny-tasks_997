import TaskItem from "./TaskItem";
import type { Task } from "../backend";

interface TaskListProps {
  uncompletedTasks: Task[];
  completedTasks: Task[];
  showCompleted: boolean;
  onToggleCompleted: () => void;
}

export default function TaskList({
  uncompletedTasks,
  completedTasks,
  showCompleted,
  onToggleCompleted,
}: TaskListProps) {
  if (uncompletedTasks.length === 0 && completedTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">No tasks yet</h3>
        <p className="text-gray-500">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {uncompletedTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Active Tasks ({uncompletedTasks.length})
          </h3>
          <div className="space-y-3">
            {uncompletedTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div>
          <button
            onClick={onToggleCompleted}
            className="text-lg font-medium text-gray-800 mb-3 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            Completed Tasks ({completedTasks.length})
          </button>
          {showCompleted && (
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
