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

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`church-footer bg-stone-800 text-stone-100 border-t-4 border-stone-600 relative ${className}`}>
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
                <h3 className="text-xl font-bold text-green-400">
                  Open Door Full Gospel Church
                </h3>
              </div>
              <p className="text-stone-300 leading-relaxed">
                Serving the Pleasant Hill, Missouri community with love, faith, and spiritual guidance. 
                All are welcome to join us in worship and fellowship.
              </p>
              <div className="text-stone-400 text-sm bg-stone-700/50 p-4 rounded-lg border-l-4 border-green-400">
                <p className="italic">
                  "Brethren, if a man is overtaken in any trespass, you who are spiritual restore such
                  a one in a spirit of gentleness, considering yourself lest you also be tempted."
                </p>
                <p className="text-green-400 font-semibold mt-2">- Galatians 6:1</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <img src={QuickLinksIcon} alt="" className="w-8 h-8 mr-3" />
                <h3 className="text-lg font-semibold text-green-400">
                  Quick Links
                </h3>
              </div>
              <nav className="space-y-3">
                <Link
                  to="/opendoor"
                  className="flex items-center text-stone-300 hover:text-green-400 transition-colors duration-200 group"
                >
                  <span className="w-2 h-2 bg-orange-300 rounded-full mr-3 group-hover:bg-green-400 transition-colors"></span>
                  Home
                </Link>
                <Link
                  to="/opendoor/Home/Location"
                  className="flex items-center text-stone-300 hover:text-green-400 transition-colors duration-200 group"
                >
                  <span className="w-2 h-2 bg-orange-300 rounded-full mr-3 group-hover:bg-green-400 transition-colors"></span>
                  Location & Directions
                </Link>
                <Link
                  to="/opendoor/Home/About"
                  className="flex items-center text-stone-300 hover:text-green-400 transition-colors duration-200 group"
                >
                  <span className="w-2 h-2 bg-orange-300 rounded-full mr-3 group-hover:bg-green-400 transition-colors"></span>
                  About Us
                </Link>
              </nav>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <img src={VisitIcon} alt="" className="w-8 h-8 mr-3" />
                <h3 className="text-lg font-semibold text-green-400">
                  Visit Us
                </h3>
              </div>
              <div className="text-stone-300 space-y-3">
                <div className="flex items-center">
                  <img src={AddressIcon} alt="" className="w-5 h-5 mr-3 opacity-70" />
                  <div>
                    <p className="text-sm font-semibold">135 S 1st St</p>
                    <p className="text-sm opacity-90">Pleasant Hill, MO 64080</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="w-5 h-5 mr-3 text-green-400 text-center">🕐</span>
                  <div>
                    <p className="text-sm font-semibold">Sunday Service</p>
                    <p className="text-sm opacity-90">10:30 AM</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <img src={FacebookIcon} alt="" className="w-5 h-5 mr-3 opacity-70" />
                  <a 
                    href="https://www.facebook.com/pages/Open-Door-Full-Gospel-Of-Pleasant-Hill-MO/217411360471"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-green-400 transition-colors"
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
              <div className="text-stone-500 text-xs text-center md:text-right">
                <p className="flex items-center justify-center md:justify-end">
                  <span className="mr-2">🚀</span>
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
