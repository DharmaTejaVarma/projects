import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work'); // work, shortBreak, longBreak
  const [settings, setSettings] = useState({
    workTime: 25,
    shortBreak: 5,
    longBreak: 15,
    autoStartBreaks: false,
    autoStartPomodoros: false,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const intervalRef = useRef(null);

  const modes = {
    work: { duration: settings.workTime * 60, label: 'Focus Time' },
    shortBreak: { duration: settings.shortBreak * 60, label: 'Short Break' },
    longBreak: { duration: settings.longBreak * 60, label: 'Long Break' },
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (mode === 'work') {
      setCompletedPomodoros(prev => prev + 1);
      // Auto-start break if enabled
      if (settings.autoStartBreaks) {
        setMode(completedPomodoros % 3 === 2 ? 'longBreak' : 'shortBreak');
        setTimeLeft(modes[completedPomodoros % 3 === 2 ? 'longBreak' : 'shortBreak'].duration);
        setIsRunning(true);
      } else {
        setMode(completedPomodoros % 3 === 2 ? 'longBreak' : 'shortBreak');
        setTimeLeft(modes[completedPomodoros % 3 === 2 ? 'longBreak' : 'shortBreak'].duration);
      }
    } else {
      // Break completed, return to work
      if (settings.autoStartPomodoros) {
        setMode('work');
        setTimeLeft(settings.workTime * 60);
        setIsRunning(true);
      } else {
        setMode('work');
        setTimeLeft(settings.workTime * 60);
      }
    }
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(modes[mode].duration);
  };

  const switchMode = (newMode) => {
    if (!isRunning) {
      setMode(newMode);
      setTimeLeft(modes[newMode].duration);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((modes[mode].duration - timeLeft) / modes[mode].duration) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Pomodoro Timer
        </h3>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {showSettings && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Timer Settings</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Work Time (min)</label>
              <input
                type="number"
                value={settings.workTime}
                onChange={(e) => setSettings(prev => ({ ...prev, workTime: parseInt(e.target.value) || 25 }))}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                min="1"
                max="60"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Short Break (min)</label>
              <input
                type="number"
                value={settings.shortBreak}
                onChange={(e) => setSettings(prev => ({ ...prev, shortBreak: parseInt(e.target.value) || 5 }))}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                min="1"
                max="30"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Long Break (min)</label>
              <input
                type="number"
                value={settings.longBreak}
                onChange={(e) => setSettings(prev => ({ ...prev, longBreak: parseInt(e.target.value) || 15 }))}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                min="1"
                max="60"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoStartBreaks"
                checked={settings.autoStartBreaks}
                onChange={(e) => setSettings(prev => ({ ...prev, autoStartBreaks: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="autoStartBreaks" className="text-xs text-gray-600 dark:text-gray-400">
                Auto-start breaks
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Mode selector */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        {Object.entries(modes).map(([key, value]) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              mode === key
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            disabled={isRunning}
          >
            {value.label}
          </button>
        ))}
      </div>

      {/* Timer display */}
      <div className="text-center mb-6">
        <div className="relative inline-flex items-center justify-center w-48 h-48">
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className="text-primary-600 transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl font-mono font-bold text-gray-900 dark:text-white">
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={isRunning ? pauseTimer : startTimer}
          className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          <span>{isRunning ? 'Pause' : 'Start'}</span>
        </button>
        <button
          onClick={resetTimer}
          className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Stats */}
      <div className="mt-6 text-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Completed Pomodoros: <span className="font-semibold text-gray-900 dark:text-white">{completedPomodoros}</span>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
