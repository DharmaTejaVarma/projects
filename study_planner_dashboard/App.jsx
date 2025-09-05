import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import { ThemeProvider } from './hooks/useTheme';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <Router>
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {/* Main content area */}
          <div className="flex flex-1 flex-col lg:pl-64">
            {/* Navbar */}
            <Navbar onMenuClick={() => setSidebarOpen(true)} />

            {/* Main Content */}
            <main className="flex-1 py-6">
              <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
