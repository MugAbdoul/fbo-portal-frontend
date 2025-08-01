import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back to home link */}
        <Link 
          to="/" 
          className="flex items-center justify-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        {/* Logo */}
        <div className="text-center">
          <img 
            className="mx-auto h-12 w-auto" 
            src="/logo-rgb.png" 
            alt="RGB"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            RGB Church Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Religious Organization Monitoring System
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;