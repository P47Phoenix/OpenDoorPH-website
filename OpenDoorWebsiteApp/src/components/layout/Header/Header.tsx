import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  return (
    <header className={`church-header bg-gradient-to-r from-stone-100 to-stone-200 shadow-lg ${className}`}>
      {/* Main Header Container */}
      <div className="church-container">
        {/* Top Header Section with Logo and Scripture */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 px-4">
          {/* Logo Section */}
          <div className="text-center lg:text-left mb-4 lg:mb-0">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-stone-800 leading-tight">
              Open{' '}
              <span className="text-church-green font-bold">Door</span>{' '}
              Full{' '}
              <span className="text-stone-500">Gospel</span>
              <span className="block text-sm md:text-base lg:text-lg text-stone-600 font-normal mt-1">
                church of pleasant hill mo
              </span>
            </h1>
          </div>
          
          {/* Scripture Quote */}
          <div className="text-center lg:text-right max-w-lg lg:max-w-md xl:max-w-lg">
            <blockquote className="text-xs md:text-sm lg:text-base text-stone-700 italic leading-relaxed">
              "Brethren, if a man is overtaken in any trespass, you who are spiritual restore such
              a one in a spirit of gentleness, considering yourself lest you also be tempted."
              <cite className="block text-church-green font-semibold mt-2 not-italic">
                Galatians 6:1
              </cite>
            </blockquote>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="border-t border-stone-300 bg-stone-50">
          <div className="px-4">
            <ul className="flex flex-col sm:flex-row sm:justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-1 py-3">
              <li>
                <Link
                  to="/opendoor"
                  className="block px-4 py-2 rounded-lg text-stone-700 hover:bg-church-green hover:text-white transition-all duration-200 font-medium text-center sm:text-left"
                  title="Open door home page"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/opendoor/Home/Location"
                  className="block px-4 py-2 rounded-lg text-stone-700 hover:bg-church-green hover:text-white transition-all duration-200 font-medium text-center sm:text-left"
                  title="Open door location page"
                >
                  Location
                </Link>
              </li>
              <li>
                <Link
                  to="/opendoor/Home/About"
                  className="block px-4 py-2 rounded-lg text-stone-700 hover:bg-church-green hover:text-white transition-all duration-200 font-medium text-center sm:text-left"
                  title="Open door about page"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Header Photo Section */}
        <div className="relative overflow-hidden rounded-lg shadow-inner bg-stone-200 mt-4">
          <img 
            src="/headerphoto.jpg" 
            alt="Open Door Baptist Church"
            className="w-full h-24 sm:h-32 md:h-40 lg:h-48 object-cover object-center"
          />
          {/* Optional overlay for better text readability if needed */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
