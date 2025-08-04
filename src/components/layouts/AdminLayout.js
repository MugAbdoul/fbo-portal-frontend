import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import {
  HomeIcon,
  FolderIcon,
  UsersIcon,
  ChartBarIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  DocumentTextIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import Button from '../ui/Button';

import { getNotifications } from '../../redux/slices/notificationSlice';
import NotificationBox from '../notifications/NotificationBox';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notifications);

  const [showNotifications, setShowNotifications] = useState(false);
  
  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);
    
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showNotifications) {
        setShowNotifications(false);
      }
    };
      
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const toggleNotifications = (e) => {
    e.stopPropagation();
    setShowNotifications(prev => !prev);
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: HomeIcon,
    },
    {
      name: 'Applications',
      href: '/admin/applications',
      icon: FolderIcon,
    },
    {
      name: 'User Management',
      href: '/admin/users',
      icon: UsersIcon,
      roles: ['CEO', 'SECRETARY_GENERAL'],
    },
    {
      name: 'Reports',
      href: '/admin/reports',
      icon: ChartBarIcon,
    },
    {
      name: 'Audit Logs',
      href: '/admin/audit-logs',
      icon: DocumentTextIcon,
      roles: ['CEO', 'SECRETARY_GENERAL'],
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const unreadNotifications = notifications?.filter(n => !n.is_read).length || 0;

  const filteredNavigation = navigation.filter(item => 
    !item.roles || item.roles.includes(user?.role)
  );

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'FBO_OFFICER':
        return 'FBO Officer';
      case 'DIVISION_MANAGER':
        return 'Division Manager';
      case 'HOD':
        return 'Head of Department';
      case 'SECRETARY_GENERAL':
        return 'Secretary General';
      case 'CEO':
        return 'Chief Executive Officer';
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      <div 
        className={clsx(
          'fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity ease-in-out duration-300 lg:hidden',
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setSidebarOpen(false)}
      />
      
      {/* Mobile sidebar panel */}
      <div 
        className={clsx(
          'fixed inset-y-0 left-0 z-40 w-72 transform transition-transform ease-in-out duration-300 lg:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col bg-white shadow-xl">
          {/* Mobile logo header */}
          <div className="relative flex-shrink-0 bg-gradient-to-r from-blue-700 to-blue-600 shadow-md">
            <div className="h-24 flex flex-col justify-center px-6">
              <div className="flex items-center">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <img
                    className="h-8 w-auto"
                    src="/logo-rgb-white.png"
                    alt="RGB"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="ml-3">
                  <span className="text-xl font-bold text-white tracking-wide">Administrative Portal</span>
                  {/* <div className="text-xs text-blue-100 mt-1"></div> */}
                </div>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 rounded-full p-1.5 bg-blue-800 bg-opacity-30 text-white hover:bg-opacity-50 transition-colors duration-200"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex flex-1 flex-col overflow-y-auto py-6">
            <nav className="flex-1 space-y-1 px-4">
              {filteredNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={clsx(
                      'group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                      isActive
                        ? 'bg-blue-100 text-blue-900 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon
                      className={clsx(
                        'mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200',
                        isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
            <div className="w-full">
              <div className="flex items-center px-2 py-3 rounded-lg bg-gray-50 shadow-sm">
                <UserCircleIcon className="h-10 w-10 text-gray-400" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">
                    {user?.firstname} {user?.lastname}
                  </p>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">
                    {getRoleDisplayName(user?.role)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white shadow-md">
          {/* Desktop logo header */}
          <div className="relative flex-shrink-0 bg-gradient-to-r from-blue-700 to-blue-600 shadow-md">
            <div className="h-16 flex flex-col justify-center px-6">
              <div className="flex items-center">
                <div className="ml-1">
                  <span className="text-lg font-bold text-white tracking-wide">Administrative Portal</span>
                  {/* <div className="text-xs text-blue-100 mt-1">Administrative Portal</div> */}
                </div>
              </div>
            </div>
            {/* Decorative bottom curve */}
            {/* <div className="absolute bottom-0 left-0 right-0 h-3 bg-white rounded-t-lg"></div> */}
          </div>
          
          <div className="flex flex-1 flex-col overflow-y-auto pt-6 pb-4">
            <nav className="flex-1 space-y-1 px-4">
              {filteredNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={clsx(
                      'group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                      isActive
                        ? 'bg-blue-100 text-blue-900 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    <Icon
                      className={clsx(
                        'mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200',
                        isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
            <div className="w-full">
              <div className="flex items-center px-3 py-3 rounded-lg bg-gray-50 shadow-sm">
                <UserCircleIcon className="h-10 w-10 text-gray-400" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">
                    {user?.firstname} {user?.lastname}
                  </p>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">
                    {getRoleDisplayName(user?.role)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top navigation */}
        <header className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors duration-200 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" />
            </button>

            <div className="flex flex-1 justify-end items-center gap-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors duration-200 relative"
                  onClick={toggleNotifications}
                >
                  <BellIcon className="h-6 w-6" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center ring-2 ring-white">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 origin-top-right">
                    <NotificationBox onClose={() => setShowNotifications(false)} />
                  </div>
                )}
              </div>

              {/* Logout button */}
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span className="hidden sm:block">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;