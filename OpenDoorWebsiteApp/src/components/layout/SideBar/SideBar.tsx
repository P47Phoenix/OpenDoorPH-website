import React from 'react';
import { ScheduleIcon, FacebookIcon, ExternalLinkIcon } from '../../../assets';

interface SideBarMenuItem {
  text: string;
  url: string;
  external?: boolean;
  icon?: 'facebook' | 'external' | 'default';
}

interface SideBarProps {
  className?: string;
  scheduleTitle?: string;
  scheduleItems?: string[];
  menuItems?: SideBarMenuItem[];
}

const SideBar: React.FC<SideBarProps> = ({ 
  className = '',
  scheduleTitle = "Sunday Service",
  scheduleItems = ["Morning Service: 10:15 AM", "Evening Service: 6:00 PM", "Bible Study: Wednesday 7:00 PM"],
  menuItems = [
    {
      text: "Facebook Page",
      url: "https://www.facebook.com/Open-Door-Full-Gospel-Of-Pleasant-Hill-MO-217411360471",
      external: true,
      icon: 'facebook'
    },
    {
      text: "Contact Us",
      url: "/opendoor/Home/Location",
      external: false,
      icon: 'default'
    }
  ]
}) => {
  const getIcon = (iconType: string = 'default') => {
    switch (iconType) {
      case 'facebook':
        return <img src={FacebookIcon} alt="" className="w-5 h-5" />;
      case 'external':
        return <img src={ExternalLinkIcon} alt="" className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <aside className={`church-sidebar w-full lg:w-64 bg-stone-50 border-r border-stone-200 ${className}`}>
      <div className="p-6 space-y-6">
        
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

        {/* Quick Links Section */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4">
          <h3 className="text-lg font-semibold text-stone-800 mb-4">
            Quick Links
          </h3>
          <nav>
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.url}
                    target={item.external ? "_blank" : "_self"}
                    rel={item.external ? "noreferrer" : undefined}
                    className="flex items-center justify-between p-3 rounded-lg text-stone-700 hover:bg-church-green hover:text-white transition-all duration-200 group"
                  >
                    <span className="flex items-center">
                      {getIcon(item.icon)}
                      <span className={`${item.icon ? 'ml-3' : ''} text-sm font-medium`}>
                        {item.text}
                      </span>
                    </span>
                    {item.external && (
                      <img 
                        src={ExternalLinkIcon} 
                        alt="External link" 
                        className="w-4 h-4 opacity-60 group-hover:opacity-100"
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Welcome Message */}
        <div className="bg-gradient-to-br from-church-green/10 to-stone-100 rounded-lg border border-church-green/20 p-4">
          <h3 className="text-lg font-semibold text-stone-800 mb-2">
            Welcome
          </h3>
          <p className="text-sm text-stone-700 leading-relaxed">
            Join us for worship and fellowship. All are welcome to experience 
            God's love and grace in our church family.
          </p>
        </div>

      </div>
    </aside>
  );
};

export default SideBar;
