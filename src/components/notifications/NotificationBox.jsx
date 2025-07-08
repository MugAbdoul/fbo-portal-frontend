// components/notifications/NotificationBox.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { markAsRead, markAllAsRead } from '../../redux/slices/notificationSlice';
import { formatDistanceToNow } from 'date-fns';
import { BellIcon, CheckIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const NotificationBox = ({ onClose }) => {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((state) => state.notifications);

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const formatTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-20 max-h-96 overflow-auto">
      <div className="p-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium">Notifications</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMarkAllAsRead}
          disabled={loading || notifications.length === 0}
        >
          Mark all as read
        </Button>
      </div>
      
      <div className="divide-y divide-gray-200">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <BellIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id}
              className={`p-3 hover:bg-gray-50 ${!notification.is_read ? 'bg-blue-50' : ''}`}
            >
              <div className="flex justify-between">
                <span className="font-medium">{notification.title}</span>
                {!notification.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <CheckIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-600">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatTime(notification.created_at)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationBox;