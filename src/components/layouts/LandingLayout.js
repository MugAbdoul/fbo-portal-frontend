import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  InformationCircleIcon, 
  QuestionMarkCircleIcon,
  BuildingOfficeIcon,
  UserIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';


const LandingLayout = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Services', href: '/services', icon: BuildingOfficeIcon },
    { name: 'About', href: '/about', icon: InformationCircleIcon },
    { name: 'FAQ', href: '/faq', icon: QuestionMarkCircleIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <img 
                  src="/logo-rgb.png" 
                  alt="RGB" 
                  className="h-10 w-10"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">RGB</h1>
                  <p className="text-xs text-gray-600">Church Authorization Portal</p>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    // eslint-disable-next-line no-undef
                    className={clsx(
                      'flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link
                to="/auth/login"
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <UserIcon className="h-5 w-5" />
                <span>Login</span>
              </Link>
              <Link
                to="/auth/register"
                className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <span>Get Started</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src="/logo-rgb-white.png" 
                  alt="RGB" 
                  className="h-8 w-8"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <h3 className="text-lg font-bold">Rwanda Governance Board</h3>
              </div>
              <p className="text-gray-300 mb-4">
                The official portal for church and religious organization authorization in Rwanda.
                Streamlining the application process for faith-based organizations.
              </p>
              <div className="text-sm text-gray-400">
                <p>© 2024 Rwanda Governance Board. All rights reserved.</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/services" className="text-gray-300 hover:text-white transition-colors">
                    Our Services
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">
                    Frequently Asked Questions
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <a 
                    href="/verify" 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Verify Certificate
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-300">
                <p>Rwanda Governance Board</p>
                <p>Kigali, Rwanda</p>
                <p>Phone: +250 788 123 456</p>
                <p>Email: info@rgb.gov.rw</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;