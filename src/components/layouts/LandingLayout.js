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


const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
  <path d="M22.675 0h-21.35C.597 0 0 .598 0 1.333v21.333C0 23.402.597 24 1.325 24h11.483v-9.294H9.692v-3.622h3.116V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.31h3.588l-.467 3.622h-3.121V24h6.116c.728 0 1.324-.598 1.324-1.334V1.333C24 .598 23.403 0 22.675 0z"/>
</svg>
);

const XIcon = () => (
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
  <path d="M22.25 0h-4.58L12 9.08 6.33 0H0l8.77 13.09L0 24h4.63l6.97-10.39L17.7 24H24l-9.16-13.82L22.25 0z"/>
</svg>
);

const LinkedinIcon = () => (
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
  <path d="M4.98 3.5C4.98 5 3.9 6 2.48 6h-.02C1.02 6 0 5 0 3.5S1.02 1 2.46 1c1.44 0 2.52 1 2.52 2.5zM.5 24h4V7.98h-4V24zM8.98 7.98H5v16.02h4v-8.53c0-2.08.57-3.5 2.97-3.5 2.35 0 2.38 2.2 2.38 3.63V24h4V15.6c0-4.36-2.33-6.38-5.44-6.38-2.52 0-3.62 1.38-4.23 2.35h.05V7.98z"/>
</svg>

);

const LandingLayout = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Services', href: '/services', icon: BuildingOfficeIcon },
    { name: 'About', href: '/about', icon: InformationCircleIcon },
    { name: 'FAQ', href: '/faq', icon: QuestionMarkCircleIcon },
  ];



const socialMedia = [
  { name: 'Facebook', href: 'https://facebook.com/rgbrwanda', icon: FacebookIcon },
  { name: 'X', href: 'https://x.com/rgbrwanda', icon: XIcon },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/rgbrwanda', icon: LinkedinIcon },
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
               <Link to="/" className="flex items-center space-x-2">
                <img 
                    src={`${process.env.PUBLIC_URL}/images/rgb_logo.png`} 
                    alt="RGB" 
                    className="h-12"
                  />
                </Link>
                {/* <div>
                  <h1 className="text-xl font-bold text-gray-900">RGB</h1>
                  <p className="text-xs text-gray-600">Church Monitoring Portal</p>
                </div> */}
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
                
                {/* Social Media Links */}
                <div className="mt-4">
                  <h5 className="text-sm font-semibold mb-2">Follow Us</h5>
                  <div className="flex space-x-4">
                    {socialMedia.map(({ name, href, icon: Icon }) => (
                      <a
                        key={name}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-white transition-colors"
                        aria-label={`Follow us on ${name}`}
                      >
                        <Icon className="h-2 w-2" />
                      </a>
                    ))}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;