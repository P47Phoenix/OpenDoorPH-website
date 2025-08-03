import React from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`church-footer bg-stone-800 text-stone-100 border-t-4 border-stone-600 ${className}`}>
      <div className="church-container">
        <div className="py-8 px-4">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Church Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-church-green mb-4">
                Open Door Full Gospel Church
              </h3>
              <p className="text-stone-300 leading-relaxed">
                Serving the Pleasant Hill, Missouri community with love, faith, and spiritual guidance. 
                All are welcome to join us in worship and fellowship.
              </p>
              <div className="text-stone-400 text-sm">
                <p className="italic">
                  "Brethren, if a man is overtaken in any trespass, you who are spiritual restore such
                  a one in a spirit of gentleness, considering yourself lest you also be tempted."
                </p>
                <p className="text-church-green font-semibold mt-2">- Galatians 6:1</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-church-green mb-4">
                Quick Links
              </h3>
              <nav className="space-y-2">
                <Link
                  to="/opendoor"
                  className="block text-stone-300 hover:text-church-green transition-colors duration-200 capitalize"
                >
                  Home
                </Link>
                <Link
                  to="/opendoor/Home/Video"
                  className="block text-stone-300 hover:text-church-green transition-colors duration-200 capitalize"
                >
                  Video Sermons
                </Link>
                <Link
                  to="/opendoor/Home/Location"
                  className="block text-stone-300 hover:text-church-green transition-colors duration-200 capitalize"
                >
                  Location & Directions
                </Link>
                <Link
                  to="/opendoor/Home/About"
                  className="block text-stone-300 hover:text-church-green transition-colors duration-200 capitalize"
                >
                  About Us
                </Link>
              </nav>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-church-green mb-4">
                Visit Us
              </h3>
              <div className="text-stone-300 space-y-2">
                <p className="text-sm">
                  Pleasant Hill, Missouri
                </p>
                <p className="text-sm">
                  Join us for worship and fellowship
                </p>
                <p className="text-sm">
                  Sunday Services &amp; Bible Study
                </p>
              </div>
            </div>
          </div>

          {/* Footer Bottom Bar */}
          <div className="border-t border-stone-600 mt-8 pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              
              {/* Copyright */}
              <div className="text-stone-400 text-sm text-center md:text-left">
                <p>
                  &copy; {currentYear} Open Door Full Gospel Church Of Pleasant Hill.
                  <span className="block md:inline md:ml-2">
                    All rights reserved.
                  </span>
                </p>
              </div>

              {/* Technical Credits */}
              <div className="text-stone-500 text-xs text-center md:text-right">
                <p>
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
