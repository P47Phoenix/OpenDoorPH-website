import React from 'react';
import { Link } from 'react-router-dom';
import {
  WebsiteIcon,
  CopyrightIcon,
  QuickLinksIcon,
  VisitIcon,
  FooterBorder,
  FacebookIcon,
  AddressIcon
} from '../../../assets';
import { trackNavClick, trackSocialClick } from '../../../utils/analytics';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`church-footer bg-stone-800 text-stone-300 border-t-4 border-stone-600 relative ${className}`}>
      {/* Decorative Border */}
      <div className="absolute top-0 left-0 right-0 h-2 overflow-hidden">
        <img src={FooterBorder} alt="" className="w-full h-full object-cover opacity-60" />
      </div>
      
      <div className="church-container">
        <div className="py-8 px-4 pt-10">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Church Information */}
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <img src={WebsiteIcon} alt="" className="w-8 h-8 mr-3" />
                <h3 className="font-serif text-xl font-bold text-white">
                  Open Door Full Gospel Church
                </h3>
              </div>
              <p className="text-stone-300 leading-relaxed">
                Serving the Pleasant Hill, Missouri community with love, faith, and spiritual guidance. 
                All are welcome to join us in worship and fellowship.
              </p>
              <blockquote className="font-serif text-stone-300 text-sm bg-stone-700 p-4 rounded-lg border-l-4 border-stone-300">
                <p className="italic">
                  "Brethren, if a man is overtaken in any trespass, you who are spiritual restore such
                  a one in a spirit of gentleness, considering yourself lest you also be tempted."
                </p>
                <p className="text-white font-semibold mt-2">- Galatians 6:1</p>
              </blockquote>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <img src={QuickLinksIcon} alt="" className="w-8 h-8 mr-3" />
                <h3 className="font-serif text-lg font-bold text-white">
                  Quick Links
                </h3>
              </div>
              <nav aria-label="Footer" className="space-y-3">
                <Link
                  to="/opendoor"
                  onClick={() => trackNavClick('Home', '/opendoor', 'footer')}
                  className="flex items-center text-stone-300 rounded transition-colors duration-150 motion-reduce:transition-none group focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-stone-800 hover:text-white"
                >
                  <span className="w-2 h-2 bg-stone-300 rounded-full mr-3 group-hover:bg-white transition-colors duration-150 motion-reduce:transition-none"></span>
                  Home
                </Link>
                <Link
                  to="/opendoor/Home/Location"
                  onClick={() => trackNavClick('Location & Directions', '/opendoor/Home/Location', 'footer')}
                  className="flex items-center text-stone-300 rounded transition-colors duration-150 motion-reduce:transition-none group focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-stone-800 hover:text-white"
                >
                  <span className="w-2 h-2 bg-stone-300 rounded-full mr-3 group-hover:bg-white transition-colors duration-150 motion-reduce:transition-none"></span>
                  Location & Directions
                </Link>
                <Link
                  to="/opendoor/Home/About"
                  onClick={() => trackNavClick('About Us', '/opendoor/Home/About', 'footer')}
                  className="flex items-center text-stone-300 rounded transition-colors duration-150 motion-reduce:transition-none group focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-stone-800 hover:text-white"
                >
                  <span className="w-2 h-2 bg-stone-300 rounded-full mr-3 group-hover:bg-white transition-colors duration-150 motion-reduce:transition-none"></span>
                  About Us
                </Link>
              </nav>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <img src={VisitIcon} alt="" className="w-8 h-8 mr-3" />
                <h3 className="font-serif text-lg font-bold text-white">
                  Visit Us
                </h3>
              </div>
              <div className="text-stone-300 space-y-3">
                <div className="flex items-center">
                  <img src={AddressIcon} alt="" className="w-5 h-5 mr-3 opacity-70" />
                  <div>
                    <p className="text-sm font-semibold">135 S 1st St</p>
                    <p className="text-sm">Pleasant Hill, MO 64080</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3 text-stone-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                  {/* Whitespace text node keeps "64080" and "Sunday" separate in textContent (napByteMatch ZIP boundary) */}
                  {' '}
                  <div>
                    <p className="text-sm font-semibold">Sunday Service</p>
                    <p className="text-sm">10:30 AM</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <img src={FacebookIcon} alt="" className="w-5 h-5 mr-3 opacity-70" />
                  <a
                    href="https://www.facebook.com/profile.php?id=100064858415448"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackSocialClick('facebook', 'footer')}
                    className="text-sm rounded transition-colors duration-150 motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-stone-800 hover:text-white"
                  >
                    Follow us on Facebook
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom Bar */}
          <div className="border-t border-stone-600 mt-8 pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              
              {/* Copyright */}
              <div className="text-stone-400 text-sm text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start">
                  <img src={CopyrightIcon} alt="" className="w-5 h-5 mr-2 opacity-60" />
                  <p>
                    {currentYear} Open Door Full Gospel Church Of Pleasant Hill.
                    <span className="block md:inline md:ml-2">
                      All rights reserved.
                    </span>
                  </p>
                </div>
              </div>

              {/* Technical Credits */}
              <div className="text-stone-400 text-xs text-center md:text-right">
                <p className="flex items-center justify-center md:justify-end">
                  Website redesigned with modern technology &amp; accessibility in mind.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
