import { useState } from 'react';
import { Check, Edit2, Trash2, Calendar, Clock } from 'lucide-react';

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const handleSave = () => {
    onEdit(task.id, {
      title: editTitle,
      description: editDescription,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow ${
      task.completed ? 'opacity-75' : ''
    }`}>
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Task title"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Task description"
            rows="3"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <button
                onClick={() => onToggleComplete(task.id)}
                className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  task.completed
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'
                }`}
              >
                {task.completed && <Check className="w-3 h-3" />}
              </button>
              <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-medium text-gray-900 dark:text-white ${
                  task.completed ? 'line-through' : ''
                }`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {task.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              {task.dueDate && (
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(task.dueDate)}
                </div>
              )}
              {task.estimatedTime && (
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3 mr-1" />
                  {task.estimatedTime}min
                </div>
              )}
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500">
              {task.category || 'General'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
