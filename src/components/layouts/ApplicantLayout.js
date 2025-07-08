import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { getNotifications } from '../../redux/slices/notificationSlice';


import {
  HomeIcon,
  DocumentPlusIcon,
  FolderIcon,
  UserIcon,
  BellIcon,
  Bars3Icon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import Button from '../ui/Button';
import NotificationBox from '../notifications/NotificationBox';

const ApplicantLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
   const [showNotifications, setShowNotifications] = useState(false);
  const { notifications } = useSelector((state) => state.notifications);

    // Fetch notifications on mount
  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);
  
  // Close notification box when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showNotifications && !e.target.closest('.notification-container')) {
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
      href: '/applicant/dashboard',
      icon: HomeIcon,
    },
    {
      name: 'New Application',
      href: '/applicant/new-application',
      icon: DocumentPlusIcon,
    },
    {
      name: 'My Applications',
      href: '/applicant/applications',
      icon: FolderIcon,
    },
    {
      name: 'Profile',
      href: '/applicant/profile',
      icon: UserIcon,
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const unreadNotifications = notifications?.filter(n => !n.is_read).length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={clsx(
        'fixed inset-0 z-40 lg:hidden',
        sidebarOpen ? 'block' : 'hidden'
      )}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col">
          <div className="flex min-h-0 flex-1 flex-col bg-white">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
              <div className="flex flex-shrink-0 items-center px-4">
                <img
                  className="h-8 w-auto"
                  src="/logo-rgb.png"
                  alt="RGB"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <span className="ml-2 text-xl font-bold text-gray-900">RGB Portal</span>
              </div>
              <nav className="mt-5 flex-1 space-y-1 px-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={clsx(
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                        isActive
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon
                        className={clsx(
                          'mr-3 h-6 w-6 flex-shrink-0',
                          isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                        )}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white shadow">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <img
                className="h-8 w-auto"
                src="/logo-rgb.png"
                alt="RGB"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className="ml-2 text-xl font-bold text-gray-900">RGB Portal</span>
            </div>
            <nav className="mt-5 flex-1 space-y-1 px-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={clsx(
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                      isActive
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <Icon
                      className={clsx(
                        'mr-3 h-6 w-6 flex-shrink-0',
                        isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex flex-shrink-0 bg-gray-50 p-4">
            <div className="group block w-full flex-shrink-0">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">
                    {user?.firstname} {user?.lastname}
                  </p>
                  <p className="text-xs font-medium text-gray-500">
                    {user?.email}
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
        <div className="sticky top-0 z-10 bg-white shadow">
          <div className="flex h-16 flex-shrink-0 items-center gap-x-4 border-b border-gray-200 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex flex-1"></div>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                {/* Notifications */}
                {/* <button
                  type="button"
                  className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 relative"
                >
                  <BellIcon className="h-6 w-6" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button> */}
                <div className="relative notification-container">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 relative"
                    onClick={toggleNotifications}
                  >
                    <BellIcon className="h-6 w-6" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                      </span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <NotificationBox onClose={() => setShowNotifications(false)} />
                  )}
                </div>

                {/* Profile dropdown */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span className="hidden sm:block">Logout</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ApplicantLayout;