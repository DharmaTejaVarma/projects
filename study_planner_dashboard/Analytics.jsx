import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Calendar, Clock, Target, Award } from 'lucide-react';

const Analytics = () => {
  const [tasks, setTasks] = useState([]);
  const [timeRange, setTimeRange] = useState('week'); // week, month, year
  const [stats, setStats] = useState({});

  useEffect(() => {
    const savedTasks = localStorage.getItem('studyPlannerTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    calculateStats();
  }, [tasks, timeRange]);

  const calculateStats = () => {
    const now = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    const filteredTasks = tasks.filter(task => 
      new Date(task.createdAt) >= startDate
    );

    const completedTasks = filteredTasks.filter(task => task.completed);
    const pendingTasks = filteredTasks.filter(task => !task.completed);
    
    const totalTime = filteredTasks.reduce((acc, task) => 
      acc + (parseInt(task.estimatedTime) || 0), 0
    );
    
    const completedTime = completedTasks.reduce((acc, task) => 
      acc + (parseInt(task.estimatedTime) || 0), 0
    );

    const productivityScore = filteredTasks.length > 0 
      ? Math.round((completedTasks.length / filteredTasks.length) * 100)
      : 0;

    setStats({
      totalTasks: filteredTasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      totalTime,
      completedTime,
      productivityScore,
      averageTaskTime: filteredTasks.length > 0 
        ? Math.round(totalTime / filteredTasks.length)
        : 0
    });
  };

  const getWeeklyData = () => {
    const data = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const dayTasks = tasks.filter(task => 
        task.createdAt && task.createdAt.split('T')[0] === dateString
      );
      
      data.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: dayTasks.filter(task => task.completed).length,
        pending: dayTasks.filter(task => !task.completed).length,
        total: dayTasks.length
      });
    }
    
    return data;
  };

  const getCategoryData = () => {
    const categories = {};
    
    tasks.forEach(task => {
      const category = task.category || 'General';
      if (!categories[category]) {
        categories[category] = { completed: 0, total: 0 };
      }
      categories[category].total++;
      if (task.completed) {
        categories[category].completed++;
      }
    });
    
    return Object.entries(categories).map(([category, data]) => ({
      category,
      completed: data.completed,
      total: data.total,
      percentage: Math.round((data.completed / data.total) * 100)
    }));
  };

  const getPriorityData = () => {
    const priorities = { high: 0, medium: 0, low: 0 };
    
    tasks.forEach(task => {
      if (priorities.hasOwnProperty(task.priority)) {
        priorities[task.priority]++;
      }
    });
    
    return Object.entries(priorities).map(([priority, count]) => ({
      priority: priority.charAt(0).toUpperCase() + priority.slice(1),
      count,
      color: priority === 'high' ? '#ef4444' : priority === 'medium' ? '#f59e0b' : '#10b981'
    }));
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your productivity and progress</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="year">Last year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Productivity</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.productivityScore}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Time</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageTaskTime}m</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Weekly Progress
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getWeeklyData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f9fafb'
                  }}
                />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
                <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Distribution by Priority */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tasks by Priority
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getPriorityData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ priority, count }) => `${priority}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {getPriorityData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f9fafb'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Category Performance
          </h3>
          <div className="space-y-4">
            {getCategoryData().map((category, index) => (
              <div key={category.category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {category.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {category.completed}/{category.total} ({category.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Tracking */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Time Tracking
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Estimated Time</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {Math.round(stats.totalTime / 60)}h {stats.totalTime % 60}m
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Completed Time</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {Math.round(stats.completedTime / 60)}h {stats.completedTime % 60}m
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Remaining Time</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {Math.round((stats.totalTime - stats.completedTime) / 60)}h {(stats.totalTime - stats.completedTime) % 60}m
              </span>
            </div>
            <div className="pt-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${stats.totalTime > 0 ? (stats.completedTime / stats.totalTime) * 100 : 0}%` 
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                {stats.totalTime > 0 ? Math.round((stats.completedTime / stats.totalTime) * 100) : 0}% of time completed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
