'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/lib/auth';
import { Moon, Sun } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  profile_image?: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [imageTimestamp, setImageTimestamp] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';

  const getProfileImageUrl = () => {
    if (user?.profile_image) {
      // Use state timestamp to prevent caching
      return `${API_BASE_URL}/storage/${user.profile_image}?t=${imageTimestamp}`;
    }
    return null;
  };

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = auth.getCurrentUser();

      if (!currentUser) {
        router.push('/login');
        return;
      }

      // Render immediately with cached user — no loading delay
      setUser(currentUser);
      setImageTimestamp(Date.now());
      setLoading(false);

      // Refresh user data silently in the background
      try {
        const freshUser = await auth.fetchCurrentUser();
        if (freshUser) {
          setUser(freshUser);
          setImageTimestamp(Date.now());
        }
      } catch {
        // Silently ignore — cached user is already showing
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    // Load theme preference
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    
    if (isDark) {
      document.documentElement.classList.add('dark-mode');
    }
    
    // Set state after DOM update
    setTimeout(() => setIsDarkMode(isDark), 0);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = async () => {
    await auth.logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">💊</div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-teal-900 flex flex-col overflow-hidden">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-teal-700">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.location.href = '/dashboard'}>
            <span className="text-2xl">💊</span>
            <span className="text-lg font-bold text-white">Pharmacy ERP</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3 space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center px-3 py-2 text-sm text-teal-100 hover:text-white hover:bg-teal-700 rounded-md font-medium transition-colors"
            >
              <span className="mr-3">📊</span>
              Dashboard
            </Link>

            {/* Products - All roles can view */}
            <Link
              href="/dashboard/products"
              className="flex items-center px-3 py-2 text-sm text-teal-100 hover:text-white hover:bg-teal-700 rounded-md font-medium transition-colors"
            >
              <span className="mr-3">📦</span>
              Products
            </Link>

            {/* Inventory - Admin, Pharmacist, Storekeeper */}
            {(user?.role === 'admin' || user?.role === 'pharmacist' || user?.role === 'storekeeper') && (
              <Link
                href="/dashboard/inventory"
                className="flex items-center px-3 py-2 text-sm text-teal-100 hover:text-white hover:bg-teal-700 rounded-md font-medium transition-colors"
              >
                <span className="mr-3">📋</span>
                Inventory
              </Link>
            )}

            {/* POS - Cashier and Admin only */}
            {(user?.role === 'cashier' || user?.role === 'admin') && (
              <Link
                href="/dashboard/pos"
                className="flex items-center px-3 py-2 text-sm text-teal-100 hover:text-white hover:bg-teal-700 rounded-md font-medium transition-colors"
              >
                <span className="mr-3">🖥️</span>
                POS
              </Link>
            )}

            {/* Sales - Not for Storekeeper */}
            {user?.role !== 'storekeeper' && (
              <Link
                href="/dashboard/sales"
                className="flex items-center px-3 py-2 text-sm text-teal-100 hover:text-white hover:bg-teal-700 rounded-md font-medium transition-colors"
              >
                <span className="mr-3">💰</span>
                Sales
              </Link>
            )}

            {/* Customers - Not for Storekeeper */}
            {user?.role !== 'storekeeper' && (
              <Link
                href="/dashboard/customers"
                className="flex items-center px-3 py-2 text-sm text-teal-100 hover:text-white hover:bg-teal-700 rounded-md font-medium transition-colors"
              >
                <span className="mr-3">👥</span>
                Customers
              </Link>
            )}

            {/* Wholesale - Admin and Pharmacist */}
            {(user?.role === 'admin' || user?.role === 'pharmacist') && (
              <Link
                href="/dashboard/wholesale"
                className="flex items-center px-3 py-2 text-sm text-teal-100 hover:text-white hover:bg-teal-700 rounded-md font-medium transition-colors"
              >
                <span className="mr-3">🏢</span>
                Wholesale
              </Link>
            )}

            {/* Reports - Admin, Pharmacist, Storekeeper */}
            {(user?.role === 'admin' || user?.role === 'pharmacist' || user?.role === 'storekeeper') && (
              <>
                <div className="pt-2">
                  <div className="px-3 py-2 text-xs font-semibold text-teal-400 uppercase tracking-wider">
                    Reports
                  </div>
                  {user?.role !== 'storekeeper' && (
                    <Link
                      href="/dashboard/reports/sales"
                      className="flex items-center px-3 py-2 text-sm text-teal-100 hover:text-white hover:bg-teal-700 rounded-md transition-colors"
                    >
                      <span className="mr-3">💰</span>
                      Sales Report
                    </Link>
                  )}
                  {user?.role !== 'storekeeper' && (
                    <Link
                      href="/dashboard/reports/profit-loss"
                      className="flex items-center px-3 py-2 text-sm text-teal-100 hover:text-white hover:bg-teal-700 rounded-md transition-colors"
                    >
                      <span className="mr-3">📊</span>
                      Profit & Loss
                    </Link>
                  )}
                  <Link
                    href="/dashboard/reports/stock-movement"
                    className="flex items-center px-3 py-2 text-sm text-teal-100 hover:text-white hover:bg-teal-700 rounded-md transition-colors"
                  >
                    <span className="mr-3">📦</span>
                    Stock Movement
                  </Link>
                  <Link
                    href="/dashboard/reports/expiry"
                    className="flex items-center px-3 py-2 text-sm text-teal-100 hover:text-white hover:bg-teal-700 rounded-md transition-colors"
                  >
                    <span className="mr-3">⚠️</span>
                    Expiry Report
                  </Link>
                </div>
              </>
            )}

            {/* Admin Only Sections */}
            {user?.role === 'admin' && (
              <>
                <Link
                  href="/dashboard/users"
                  className="flex items-center px-3 py-2 text-sm text-teal-100 hover:text-white hover:bg-teal-700 rounded-md font-medium transition-colors"
                >
                  <span className="mr-3">👤</span>
                  Users
                </Link>
                <div className="pt-2">
                  <div className="px-3 py-2 text-xs font-semibold text-teal-400 uppercase tracking-wider">
                    Compliance
                  </div>
                  <Link
                    href="/dashboard/compliance"
                    className="flex items-center px-3 py-2 text-sm text-teal-100 hover:text-white hover:bg-teal-700 rounded-md transition-colors"
                  >
                    <span className="mr-3">🛡️</span>
                    Overview
                  </Link>
                  <Link
                    href="/dashboard/compliance/audit-trail"
                    className="flex items-center px-3 py-2 text-sm text-teal-100 hover:text-white hover:bg-teal-700 rounded-md transition-colors"
                  >
                    <span className="mr-3">📋</span>
                    Audit Trail
                  </Link>
                  <Link
                    href="/dashboard/compliance/controlled-drugs"
                    className="flex items-center px-3 py-2 text-sm text-teal-100 hover:text-white hover:bg-teal-700 rounded-md transition-colors"
                  >
                    <span className="mr-3">💊</span>
                    Controlled Drugs
                  </Link>
                  <Link
                    href="/dashboard/compliance/inspection"
                    className="flex items-center px-3 py-2 text-sm text-teal-100 hover:text-white hover:bg-teal-700 rounded-md transition-colors"
                  >
                    <span className="mr-3">🔍</span>
                    Inspection Report
                  </Link>
                </div>
                <Link
                  href="/dashboard/activity-logs"
                  className="flex items-center px-3 py-2 text-sm text-teal-100 hover:text-white hover:bg-teal-700 rounded-md font-medium transition-colors"
                >
                  <span className="mr-3">📝</span>
                  Activity Logs
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-teal-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-semibold text-white">{user?.name}</div>
              <div className="text-xs text-teal-300 capitalize">{user?.role}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-md font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-teal-700 flex items-center justify-between px-6 shadow-md">
          <h1 className="text-xl font-semibold text-white">Pharmacy Management System</h1>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-teal-600 transition-colors text-white"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-teal-600 transition-colors"
              >
                {getProfileImageUrl() ? (
                  <div className="w-9 h-9 rounded-full overflow-hidden relative">
                    <Image
                      src={getProfileImageUrl()!}
                      alt={user?.name || 'User'}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-9 h-9 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold border-2 border-teal-300">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-left">
                  <div className="text-sm font-semibold text-white">{user?.name}</div>
                  <div className="text-xs text-teal-200 capitalize">{user?.role}</div>
                </div>
                <svg className="w-4 h-4 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="text-sm font-semibold text-gray-900">{user?.name}</div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <span className="mr-3">👤</span>
                    My Profile
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <span className="mr-3">⚙️</span>
                    Settings
                  </Link>
                  <div className="border-t border-gray-200 my-2"></div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <span className="mr-3">🚪</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 min-h-0">
          {children}
        </main>

        {/* Footer */}
        <footer className="shrink-0 bg-teal-700 py-4 px-6">
          <div className="text-center text-sm text-teal-100">
            © 2026 Pharmacy ERP System. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
