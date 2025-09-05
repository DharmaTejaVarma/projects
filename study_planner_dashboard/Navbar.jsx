import { useState } from "react";
import { Menu, Sun, Moon, Bell, User } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { useLocation } from "react-router-dom";

const Navbar = ({ onMenuClick }) => {
  const { isDark, toggleTheme } = useTheme();
  const [notifications] = useState(3); // Mock notification count
  const location = useLocation();

  // Map routes to titles
  const pageTitles = {
    "/": "Dashboard",
    "/calendar": "Calendar",
    "/analytics": "Analytics",
    "/settings": "Settings",
  };

  const currentTitle = pageTitles[location.pathname] || "Study Planner";

  return (
    <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:px-6 lg:px-8">
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          type="button"
          className="p-2 text-gray-600 hover:text-gray-900 lg:hidden dark:text-gray-300 dark:hover:text-white"
          onClick={onMenuClick}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* Page title */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {currentTitle}
        </h2>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Theme toggle */}
        <button
          type="button"
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
          onClick={toggleTheme}
        >
          <span className="sr-only">Toggle theme</span>
          {isDark ? (
            <Sun className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Moon className="h-5 w-5" aria-hidden="true" />
          )}
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
        >
          <span className="sr-only">View notifications</span>
          <Bell className="h-5 w-5" aria-hidden="true" />
          {notifications > 0 && (
            <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
              {notifications}
            </span>
          )}
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            type="button"
            className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <span className="sr-only">Open user menu</span>
            <User className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
