import React from 'react';
import { ScheduleIcon, FacebookIcon, QuickMap } from '../../../assets';

interface SideBarProps {
  className?: string;
  scheduleTitle?: string;
  scheduleItems?: string[];
}

const SideBar: React.FC<SideBarProps> = ({ 
  className = '',
  scheduleTitle = "Sunday Service",
  scheduleItems = ["Morning Service: 10:30 AM"]
}) => {
  return (
    <aside className={`church-sidebar w-full lg:w-80 lg:min-w-80 lg:max-w-80 bg-stone-50 border-r border-stone-200 ${className}`}>
      <div className="p-6 space-y-6">
        
        {/* Mobile Quick Contact Actions - Only visible on mobile */}
        <div className="block md:hidden bg-gradient-to-r from-green-500 to-orange-300 rounded-lg p-4 shadow-md">
          <h3 className="text-white font-semibold mb-3 text-center">Quick Contact</h3>
          <div className="flex justify-center space-x-6">
            <a 
              href="https://www.facebook.com/pages/Open-Door-Full-Gospel-Of-Pleasant-Hill-MO/217411360471" 
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center p-3 bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-all touch-manipulation active:scale-95"
              aria-label="Visit our Facebook page"
            >
              <img src={FacebookIcon} alt="" className="w-8 h-8 mb-1" />
              <span className="text-xs text-white font-medium">Facebook</span>
            </a>
            <a 
              href="/opendoor/Home/Location" 
              className="flex flex-col items-center p-3 bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-all touch-manipulation active:scale-95"
              aria-label="View location"
            >
              <img src={QuickMap} alt="" className="w-8 h-8 mb-1" />
              <span className="text-xs text-white font-medium">Visit</span>
            </a>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4">
          <div className="flex items-center mb-4">
            <img src={ScheduleIcon} alt="" className="w-6 h-6 mr-3" />
            <h3 className="text-lg font-semibold text-stone-800">
              {scheduleTitle}
            </h3>
          </div>
          <div className="space-y-2">
            {scheduleItems.map((item, index) => (
              <p key={index} className="text-sm text-stone-600 leading-relaxed">
                {item}
              </p>
            ))}
          </div>
        </div>

        {/* Welcome Message */}
        <div className="bg-gradient-to-br from-green-500/10 to-stone-100 rounded-lg border border-green-500/20 p-4">
          <h3 className="text-lg font-semibold text-stone-800 mb-2">
            Welcome
          </h3>
          <p className="text-sm text-stone-700 leading-relaxed">
            Join us for worship and fellowship. All are welcome to experience 
            God's love and grace in our church family.
          </p>
          
          {/* Mobile-specific call-to-action */}
          <div className="block md:hidden mt-4">
            <a 
              href="/opendoor/Home/About" 
              className="inline-flex items-center px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors touch-manipulation active:bg-green-700"
            >
              Learn More About Us
              <span className="ml-2">→</span>
            </a>
          </div>
        </div>

      </div>
    </aside>
  );
};

export default SideBar;
