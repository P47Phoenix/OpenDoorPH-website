import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HamburgerMenu, CloseButton } from '../../../assets';
import { trackNavClick, trackMobileMenuToggle } from '../../../utils/analytics';

interface HeaderProps {
  className?: string;
}

const DESKTOP_LINK =
  'block px-4 py-2 rounded-lg text-ink font-semibold text-sm transition-colors duration-150 motion-reduce:transition-none touch-manipulation focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 focus:ring-offset-parchment hover:text-brick-dark hover:bg-white active:bg-rule';

const MOBILE_LINK =
  'block px-6 py-4 rounded-lg text-ink text-center font-medium transition-colors duration-150 motion-reduce:transition-none touch-manipulation min-h-[44px] focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 focus:ring-offset-parchment hover:bg-white hover:text-brick-dark active:bg-rule';

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    trackMobileMenuToggle(isMobileMenuOpen ? 'close' : 'open');
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleDesktopNavClick = (linkText: string, linkUrl: string) => {
    trackNavClick(linkText, linkUrl, 'header_desktop');
  };

  const handleMobileNavClick = (linkText: string, linkUrl: string) => {
    trackNavClick(linkText, linkUrl, 'header_mobile');
    closeMobileMenu();
  };

  return (
    <header className={`church-header sticky top-0 z-40 ${className}`}>
      <div className="church-container flex items-center justify-between min-h-16 md:min-h-[72px]">
        {/* Wordmark: short single text node at <md, full spans (sr-only at <md) for the heading contract */}
        <h1 className="font-serif font-bold text-ink leading-tight text-lg md:text-2xl">
          <span className="md:hidden" aria-hidden="true">Open Door</span>
          <span className="sr-only md:not-sr-only">
            Open <span className="text-brick">Door</span> Full <span className="text-sage">Gospel</span>
            <span className="block text-xs md:text-sm text-stone-600 font-sans font-normal tracking-wide uppercase">
              church of pleasant hill mo
            </span>
          </span>
        </h1>

        <nav aria-label="Primary">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg transition-colors duration-150 motion-reduce:transition-none touch-manipulation min-h-[44px] min-w-[44px] hover:bg-white active:bg-rule focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 focus:ring-offset-parchment"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <img
              src={isMobileMenuOpen ? CloseButton : HamburgerMenu}
              alt=""
              className="w-8 h-8"
            />
          </button>

          {/* Desktop Navigation - Always visible on md+ screens */}
          <ul className="hidden md:flex items-center gap-1">
            <li>
              <Link
                to="/opendoor"
                onClick={() => handleDesktopNavClick('Home', '/opendoor')}
                className={DESKTOP_LINK}
                title="Open door home page"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/opendoor/Home/Location"
                onClick={() => handleDesktopNavClick('Location', '/opendoor/Home/Location')}
                className={DESKTOP_LINK}
                title="Open door location page"
              >
                Location
              </Link>
            </li>
            <li>
              <Link
                to="/opendoor/Home/About"
                onClick={() => handleDesktopNavClick('About', '/opendoor/Home/About')}
                className={DESKTOP_LINK}
                title="Open door about page"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/opendoor/Home/Scripture"
                onClick={() => handleDesktopNavClick('Galatians 6:1', '/opendoor/Home/Scripture')}
                className={DESKTOP_LINK}
                title="Scripture study - Galatians 6:1"
              >
                Galatians 6:1
              </Link>
            </li>
          </ul>

          {/* Mobile Navigation Menu - Collapsible; header is the containing block */}
          <div
            id="mobile-menu"
            className={`md:hidden absolute inset-x-0 top-full z-40 bg-parchment border-b border-rule overflow-hidden transition-all duration-150 ease-in-out motion-reduce:transition-none ${
              isMobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
            } ${isMobileMenuOpen ? 'visible' : 'invisible'}`}
          >
            <ul className="space-y-1 pb-4">
              <li>
                <Link
                  to="/opendoor"
                  onClick={() => handleMobileNavClick('Home', '/opendoor')}
                  className={MOBILE_LINK}
                  title="Open door home page"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/opendoor/Home/Location"
                  onClick={() => handleMobileNavClick('Location', '/opendoor/Home/Location')}
                  className={MOBILE_LINK}
                  title="Open door location page"
                >
                  Location
                </Link>
              </li>
              <li>
                <Link
                  to="/opendoor/Home/About"
                  onClick={() => handleMobileNavClick('About', '/opendoor/Home/About')}
                  className={MOBILE_LINK}
                  title="Open door about page"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/opendoor/Home/Scripture"
                  onClick={() => handleMobileNavClick('Galatians 6:1', '/opendoor/Home/Scripture')}
                  className={MOBILE_LINK}
                  title="Scripture study - Galatians 6:1"
                >
                  Galatians 6:1
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
