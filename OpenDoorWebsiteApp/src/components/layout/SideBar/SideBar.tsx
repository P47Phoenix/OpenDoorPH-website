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
    <aside className={`w-full ${className}`}>
      <div className="p-4 md:p-6 space-y-6">

        {/* Mobile Quick Contact Actions - Only visible on mobile */}
        <div className="block md:hidden bg-sage rounded-lg p-4">
          <h3 className="font-serif text-white font-bold text-lg mb-3 text-center">Quick Contact</h3>
          <div className="flex justify-center gap-6">
            <a
              href="https://www.facebook.com/profile.php?id=100064858415448"
              target="_blank"
              rel="noreferrer"
              onClick={() => trackSocialClick('facebook', 'sidebar_mobile')}
              className="group flex flex-col items-center p-3 min-w-[64px] min-h-[64px] bg-white text-sage rounded-lg transition-colors duration-150 motion-reduce:transition-none touch-manipulation hover:bg-parchment hover:text-sage-dark active:bg-rule active:text-sage-dark focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sage"
              aria-label="Visit our Facebook page"
            >
              <img src={FacebookIcon} alt="" className="w-8 h-8 mb-1" />
              <span className="text-xs font-medium text-sage group-hover:text-sage-dark">Facebook</span>
            </a>
            <Link
              to="/opendoor/Home/Location"
              onClick={() => trackNavClick('Visit', '/opendoor/Home/Location', 'sidebar')}
              className="group flex flex-col items-center p-3 min-w-[64px] min-h-[64px] bg-white text-sage rounded-lg transition-colors duration-150 motion-reduce:transition-none touch-manipulation hover:bg-parchment hover:text-sage-dark active:bg-rule active:text-sage-dark focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sage"
              aria-label="View location"
            >
              <img src={QuickMap} alt="" className="w-8 h-8 mb-1" />
              <span className="text-xs font-medium text-sage group-hover:text-sage-dark">Visit</span>
            </Link>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <img src={ScheduleIcon} alt="" className="w-6 h-6 mr-3" aria-hidden="true" />
            <h3 className="font-serif text-lg font-bold text-ink">Schedule</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EVENTS.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg border border-rule p-4"
              >
                <h4 className="font-serif text-base font-bold text-ink mb-2">
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
        <div className="bg-white rounded-lg border border-rule p-4">
          <h3 className="font-serif text-lg font-bold text-ink mb-2">
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
              className="inline-flex items-center px-4 py-2 bg-sage text-white text-sm font-medium rounded-lg transition-colors duration-150 motion-reduce:transition-none touch-manipulation min-h-[44px] hover:bg-sage-dark active:bg-sage-dark focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 focus:ring-offset-white"
            >
              Learn More About Us
            </Link>
          </div>
        </div>

        {/* Facebook Subscribe Card */}
        <div className="bg-white rounded-lg border border-rule p-4">
          <div className="flex items-center mb-4">
            <img src={FacebookIcon} alt="" className="w-6 h-6 mr-3" />
            <h3 className="font-serif text-lg font-bold text-ink">
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
            className="inline-flex items-center justify-center w-full px-4 py-3 bg-sage text-white text-sm font-medium rounded-lg transition-colors duration-150 motion-reduce:transition-none touch-manipulation min-h-[44px] hover:bg-sage-dark active:bg-sage-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage focus:ring-offset-white"
          >
            Follow on Facebook
          </a>
        </div>

      </div>
    </aside>
  );
};

export default SideBar;
