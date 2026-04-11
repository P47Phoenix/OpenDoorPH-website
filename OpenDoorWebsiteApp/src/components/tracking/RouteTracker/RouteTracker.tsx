/**
 * Route Tracker Component
 *
 * This component tracks route changes and sends page view events to Google Analytics 4.
 * It wraps around route components to automatically track navigation.
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackNavigation } from '../../../utils/analytics';
import { useScrollDepth } from '../../../hooks/useScrollDepth';

interface RouteTrackerProps {
  children: React.ReactNode;
}

// Functional component for route tracking
export const RouteTracker: React.FC<RouteTrackerProps> = ({ children }) => {
  const location = useLocation();
  const previousPath = React.useRef<string>('');

  // Story 2.4: Scroll depth tracking via IntersectionObserver
  useScrollDepth();

  React.useEffect(() => {
    // Track navigation between pages
    if (previousPath.current && previousPath.current !== location.pathname) {
      trackNavigation(previousPath.current, location.pathname);
    }

    // Track page view
    trackPageView(location.pathname);

    // Update previous path
    previousPath.current = location.pathname;
  }, [location.pathname]);

  return <>{children}</>;
};
