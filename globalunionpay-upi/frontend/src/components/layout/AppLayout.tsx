import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuthStore } from '../../store/store';
import { useWebSocket } from '../../hooks/useWebSocket';
import { Toaster } from 'react-hot-toast';

export default function AppLayout() {
  const { isAuthenticated } = useAuthStore();
  const [darkMode, setDarkMode] = useState(false);
  useWebSocket();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar darkMode={darkMode} toggleDark={() => setDarkMode(!darkMode)} />
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </div>
  );
};
