import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem('studyPlannerTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getTasksForDate = (date) => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate === dateString);
  };

  const getTasksForSelectedDate = () => {
    if (!selectedDate) return [];
    return getTasksForDate(selectedDate);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h1>
          <p className="text-gray-600 dark:text-gray-400">View your tasks by due date</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatDate(currentDate)}
              </h2>
              
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const dayTasks = getTasksForDate(day);
                const isCurrentDay = isToday(day);
                const isSelectedDay = isSelected(day);
                
                return (
                  <div
                    key={index}
                    className={`
                      min-h-[100px] p-2 border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                      ${isCurrentDay ? 'bg-primary-50 dark:bg-primary-900 border-primary-300 dark:border-primary-700' : ''}
                      ${isSelectedDay ? 'bg-primary-100 dark:bg-primary-800 border-primary-400 dark:border-primary-600' : ''}
                      ${!day ? 'bg-gray-50 dark:bg-gray-900' : ''}
                    `}
                    onClick={() => day && setSelectedDate(day)}
                  >
                    {day && (
                      <>
                        <div className={`
                          text-sm font-medium mb-1
                          ${isCurrentDay ? 'text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-white'}
                        `}>
                          {day.getDate()}
                        </div>
                        
                        {/* Task indicators */}
                        <div className="space-y-1">
                          {dayTasks.slice(0, 3).map((task, taskIndex) => (
                            <div
                              key={taskIndex}
                              className={`
                                h-1 w-full rounded-full ${getPriorityColor(task.priority)}
                                ${task.completed ? 'opacity-50' : ''}
                              `}
                              title={task.title}
                            />
                          ))}
                          {dayTasks.length > 3 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              +{dayTasks.length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Task Details Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Tasks */}
          {selectedDate && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CalendarIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </h3>
              </div>

              <div className="space-y-3">
                {getTasksForSelectedDate().length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No tasks scheduled for this date
                  </p>
                ) : (
                  getTasksForSelectedDate().map(task => (
                    <div
                      key={task.id}
                      className={`p-3 rounded-lg border ${
                        task.completed
                          ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-medium ${
                            task.completed
                              ? 'text-gray-500 dark:text-gray-400 line-through'
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 ml-2">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                          {task.estimatedTime && (
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="w-3 h-3 mr-1" />
                              {task.estimatedTime}min
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Upcoming Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Upcoming Tasks
            </h3>
            
            <div className="space-y-3">
              {tasks
                .filter(task => !task.completed && task.dueDate)
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                .slice(0, 5)
                .map(task => (
                  <div
                    key={task.id}
                    className="p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => setSelectedDate(new Date(task.dueDate))}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {task.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(task.dueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
