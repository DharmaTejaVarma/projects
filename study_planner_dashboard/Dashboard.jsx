import { useState, useEffect } from "react";
import TaskCard from "../components/TaskCard";
import PomodoroTimer from "../components/PomodoroTimer";
import QuoteBox from "../components/QuoteBox";
import { Plus, Filter, Search, Calendar, Clock, CheckCircle } from "lucide-react";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all"); // all, pending, completed
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    estimatedTime: "",
    category: "General",
  });

  // Load tasks
  useEffect(() => {
    const savedTasks = localStorage.getItem("studyPlannerTasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      const demoTasks = [
        {
          id: 1,
          title: "Complete React project setup",
          description: "Set up the basic structure and install dependencies",
          priority: "high",
          dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
          estimatedTime: 120,
          category: "Development",
          completed: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          title: "Study JavaScript concepts",
          description: "Review closures, promises, and async/await",
          priority: "medium",
          dueDate: new Date(Date.now() + 1 * 86400000).toISOString().split("T")[0],
          estimatedTime: 90,
          category: "Study",
          completed: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 3,
          title: "Prepare presentation slides",
          description: "Create slides for the quarterly review meeting",
          priority: "low",
          dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
          estimatedTime: 60,
          category: "Work",
          completed: true,
          createdAt: new Date().toISOString(),
        },
      ];
      setTasks(demoTasks);
      localStorage.setItem("studyPlannerTasks", JSON.stringify(demoTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("studyPlannerTasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.title.trim()) {
      const task = {
        id: Date.now(),
        ...newTask,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTasks([...tasks, task]);
      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
        estimatedTime: "",
        category: "General",
      });
      setShowAddTask(false);
    }
  };

  const toggleTaskComplete = (taskId) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)));
  };

  const editTask = (taskId, updates) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "pending" && !task.completed) ||
      (filter === "completed" && task.completed);

    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
    overdue: tasks.filter(
      (t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
    ).length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here’s your study overview.
          </p>
        </div>
        <button
          onClick={() => setShowAddTask(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Tasks", value: stats.total, color: "blue", icon: CheckCircle },
          { label: "Completed", value: stats.completed, color: "green", icon: CheckCircle },
          { label: "Pending", value: stats.pending, color: "yellow", icon: Clock },
          { label: "Overdue", value: stats.overdue, color: "red", icon: Calendar },
        ].map(({ label, value, color, icon: Icon }) => (
          <div
            key={label}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-md hover:shadow-lg transition"
          >
            <div className="flex items-center">
              <div className={`p-2 bg-${color}-100 dark:bg-${color}-900 rounded-lg`}>
                <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks */}
        <div className="lg:col-span-2 space-y-4">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {searchTerm
                  ? "No tasks match your search."
                  : "No tasks yet. Add one to get started!"}
              </div>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={toggleTaskComplete}
                  onEdit={editTask}
                  onDelete={deleteTask}
                />
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <PomodoroTimer />
          <QuoteBox />
        </div>
      </div>

      {/* Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add New Task
            </h3>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Enter task description"
                />
              </div>

              {/* Priority & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Study, Work"
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Est. Time (min)
                  </label>
                  <input
                    type="number"
                    value={newTask.estimatedTime}
                    onChange={(e) => setNewTask({ ...newTask, estimatedTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="60"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddTask(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={addTask}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
