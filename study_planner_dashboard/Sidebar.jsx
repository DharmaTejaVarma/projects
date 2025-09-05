import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Calendar,
  BarChart3,
  Settings,
  X,
  CheckSquare,
  Clock,
  Quote,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const quickActions = [
    { name: "Add Task", icon: CheckSquare, action: "addTask" },
    { name: "Start Timer", icon: Clock, action: "startTimer" },
    { name: "Daily Quote", icon: Quote, action: "showQuote" },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-56 bg-gray-900 text-gray-100 
          shadow-lg transform transition-transform duration-300 ease-in-out 
          lg:translate-x-0 lg:static lg:inset-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-700">
            <h1 className="text-lg font-bold">Study Planner</h1>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-2">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }
                    `}
                    onClick={onClose}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="pt-6">
              <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Quick Actions
              </h3>
              <div className="mt-2 space-y-1">
                {quickActions.map((action) => (
                  <button
                    key={action.name}
                    className="group flex items-center w-full gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    onClick={() => {
                      // Handle quick actions
                      onClose();
                    }}
                  >
                    <action.icon className="h-5 w-5" />
                    {action.name}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            <div className="text-xs text-gray-400 text-center">
              Study Planner v1.0.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
