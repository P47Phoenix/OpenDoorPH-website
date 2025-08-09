import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HamburgerMenu, CloseButton } from '../../../assets';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`church-header bg-gradient-to-r from-stone-100 to-stone-200 shadow-lg ${className}`}>
      {/* Main Header Container */}
      <div className="church-container">
        {/* Logo Section at Top */}
        <div className="text-center py-4 px-4 border-b border-stone-300">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-stone-800 leading-tight">
            Open{' '}
            <span className="text-green-500 font-bold">Door</span>{' '}
            Full{' '}
            <span className="text-stone-500">Gospel</span>
            <span className="block text-sm md:text-base lg:text-lg text-stone-600 font-normal mt-1">
              church of pleasant hill mo
            </span>
          </h1>
        </div>

        {/* Centered Scripture Quote Below Logo */}
        <div className="text-center py-4 px-4">
          <blockquote className="text-xs md:text-sm lg:text-base text-stone-700 italic leading-relaxed max-w-4xl mx-auto">
            "Brethren, if a man is overtaken in any trespass, you who are spiritual restore such
            a one in a spirit of gentleness, considering yourself lest you also be tempted."
            <cite className="block text-green-500 font-semibold mt-2 not-italic">
              Galatians 6:1
            </cite>
          </blockquote>
        </div>

        {/* Navigation Bar */}
        <nav className="border-t border-stone-300 bg-stone-50 relative">
          <div className="px-4">
            {/* Mobile Menu Button */}
            <div className="flex justify-between items-center py-3 md:hidden">
              <span className="text-stone-700 font-medium">Menu</span>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg hover:bg-stone-200 transition-colors touch-manipulation"
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
              >
                <img 
                  src={isMobileMenuOpen ? CloseButton : HamburgerMenu} 
                  alt="" 
                  className="w-8 h-8" 
                />
              </button>
            </div>

            {/* Desktop Navigation - Always visible on md+ screens */}
            <ul className="hidden md:flex md:justify-center lg:justify-start space-x-1 py-3">
              <li>
                <Link
                  to="/opendoor"
                  className="block px-6 py-3 rounded-lg text-stone-700 hover:bg-green-500 hover:text-white transition-all duration-200 font-medium touch-manipulation"
                  title="Open door home page"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/opendoor/Home/Location"
                  className="block px-6 py-3 rounded-lg text-stone-700 hover:bg-green-500 hover:text-white transition-all duration-200 font-medium touch-manipulation"
                  title="Open door location page"
                >
                  Location
                </Link>
              </li>
              <li>
                <Link
                  to="/opendoor/Home/About"
                  className="block px-6 py-3 rounded-lg text-stone-700 hover:bg-green-500 hover:text-white transition-all duration-200 font-medium touch-manipulation"
                  title="Open door about page"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/opendoor/Home/Scripture"
                  className="block px-6 py-3 rounded-lg text-stone-700 hover:bg-green-500 hover:text-white transition-all duration-200 font-medium touch-manipulation"
                  title="Scripture study - Galatians 6:1"
                >
                  Galatians 6:1
                </Link>
              </li>
            </ul>

            {/* Mobile Navigation Menu - Collapsible */}
            <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
              isMobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <ul className="space-y-2 pb-4">
                <li>
                  <Link
                    to="/opendoor"
                    onClick={closeMobileMenu}
                    className="block px-6 py-4 rounded-lg text-stone-700 hover:bg-green-500 hover:text-white transition-all duration-200 font-medium text-center touch-manipulation active:bg-green-600"
                    title="Open door home page"
                  >
                    🏠 Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/opendoor/Home/Location"
                    onClick={closeMobileMenu}
                    className="block px-6 py-4 rounded-lg text-stone-700 hover:bg-green-500 hover:text-white transition-all duration-200 font-medium text-center touch-manipulation active:bg-green-600"
                    title="Open door location page"
                  >
                    📍 Location
                  </Link>
                </li>
                <li>
                  <Link
                    to="/opendoor/Home/About"
                    onClick={closeMobileMenu}
                    className="block px-6 py-4 rounded-lg text-stone-700 hover:bg-green-500 hover:text-white transition-all duration-200 font-medium text-center touch-manipulation active:bg-green-600"
                    title="Open door about page"
                  >
                    ℹ️ About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/opendoor/Home/Scripture"
                    onClick={closeMobileMenu}
                    className="block px-6 py-4 rounded-lg text-stone-700 hover:bg-green-500 hover:text-white transition-all duration-200 font-medium text-center touch-manipulation active:bg-green-600"
                    title="Scripture study - Galatians 6:1"
                  >
                    📖 Galatians 6:1
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
