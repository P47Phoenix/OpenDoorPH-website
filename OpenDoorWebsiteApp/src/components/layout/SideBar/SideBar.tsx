import React from 'react';
import { Link } from 'react-router-dom';
import { ScheduleIcon, FacebookIcon, QuickMap } from '../../../assets';
import { trackNavClick, trackCtaClick, trackSocialClick } from '../../../utils/analytics';
import { EVENTS } from '../../../config/events';
import AddToCalendarButton from '../../AddToCalendarButton';

interface SideBarProps {
  className?: string;
}

const SideBar: React.FC<SideBarProps> = ({
  className = '',
}) => {
  return (
    <aside className={`church-sidebar w-full lg:w-80 lg:min-w-80 lg:max-w-80 bg-stone-50 border-r border-stone-200 ${className}`}>
      <div className="p-6 space-y-6">

        {/* Mobile Quick Contact Actions - Only visible on mobile */}
        <div className="block md:hidden bg-gradient-to-r from-green-500 to-orange-300 rounded-lg p-4 shadow-md">
          <h3 className="text-white font-semibold mb-3 text-center">Quick Contact</h3>
          <div className="flex justify-center space-x-6">
            <a
              href="https://www.facebook.com/profile.php?id=100064858415448"
              target="_blank"
              rel="noreferrer"
              onClick={() => trackSocialClick('facebook', 'sidebar_mobile')}
              className="flex flex-col items-center p-3 bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-all touch-manipulation active:scale-95"
              aria-label="Visit our Facebook page"
            >
              <img src={FacebookIcon} alt="" className="w-8 h-8 mb-1" />
              <span className="text-xs text-white font-medium">Facebook</span>
            </a>
            <Link
              to="/opendoor/Home/Location"
              onClick={() => trackNavClick('Visit', '/opendoor/Home/Location', 'sidebar')}
              className="flex flex-col items-center p-3 bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-all touch-manipulation active:scale-95"
              aria-label="View location"
            >
              <img src={QuickMap} alt="" className="w-8 h-8 mb-1" />
              <span className="text-xs text-white font-medium">Visit</span>
            </Link>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <img src={ScheduleIcon} alt="" className="w-6 h-6 mr-3" aria-hidden="true" />
            <h3 className="text-lg font-semibold text-stone-800">Schedule</h3>
          </div>
          <div className="space-y-4">
            {EVENTS.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-sm border border-stone-200 p-4"
              >
                <h4 className="text-base font-semibold text-stone-800 mb-2">
                  {event.title}
                </h4>
                <div className="space-y-1 mb-3">
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {event.subtitle}
                  </p>
                  <p className="text-sm font-medium text-stone-700">
                    {event.time}
                  </p>
                </div>
                <AddToCalendarButton event={event} />
              </div>
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
            <Link
              to="/opendoor/Home/About"
              onClick={() => trackCtaClick('Learn More About Us', 'sidebar', '/opendoor/Home/About')}
              className="inline-flex items-center px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors touch-manipulation active:bg-green-700"
            >
              Learn More About Us
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>

        {/* Facebook Subscribe Card */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4">
          <div className="flex items-center mb-4">
            <img src={FacebookIcon} alt="" className="w-6 h-6 mr-3" />
            <h3 className="text-lg font-semibold text-stone-800">
              Follow Us on Facebook
            </h3>
          </div>
          <p className="text-sm text-stone-600 leading-relaxed mb-4">
            Stay connected with our church family for updates, events, and inspiration.
          </p>
          <a
            href="https://www.facebook.com/profile.php?id=100064858415448"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackSocialClick('facebook', 'sidebar_desktop')}
            aria-label="Follow us on Facebook (opens in new tab)"
            className="inline-flex items-center justify-center w-full px-4 py-3 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Follow on Facebook →
          </a>
        </div>

      </div>
    </aside>
  );
};

export default SideBar;
