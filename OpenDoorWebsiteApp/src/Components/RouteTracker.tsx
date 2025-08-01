/**
 * Route Tracker Component
 * 
 * This component tracks route changes and sends page view events to Google Analytics 4.
 * It wraps around route components to automatically track navigation.
 */

import React, { Component, ReactElement } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackNavigation } from '../utils/analytics';

interface RouteTrackerProps {
  children: React.ReactNode;
}

interface RouteTrackerState {
  previousPath: string;
}

// Higher-order component to add route tracking to any component
export function withRouteTracking<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function RouteTrackedComponent(props: P) {
    const location = useLocation();
    
    React.useEffect(() => {
      // Track page view when route changes
      trackPageView(location.pathname);
    }, [location.pathname]);

    return <WrappedComponent {...props} />;
  };
}

// Functional component for route tracking
export const RouteTracker: React.FC<RouteTrackerProps> = ({ children }) => {
  const location = useLocation();
  const [previousPath, setPreviousPath] = React.useState<string>('');

  React.useEffect(() => {
    // Track navigation between pages
    if (previousPath && previousPath !== location.pathname) {
      trackNavigation(previousPath, location.pathname);
    }
    
    // Track page view
    trackPageView(location.pathname);
    
    // Update previous path
    setPreviousPath(location.pathname);
  }, [location.pathname, previousPath]);

  return <>{children}</>;
};

// Class-based route tracker for legacy components
export class RouteTrackerClass extends Component<RouteTrackerProps, RouteTrackerState> {
  constructor(props: RouteTrackerProps) {
    super(props);
    this.state = {
      previousPath: ''
    };
  }

  componentDidMount(): void {
    // Track initial page load
    const currentPath = window.location.pathname;
    trackPageView(currentPath);
    this.setState({ previousPath: currentPath });
  }

  componentDidUpdate(): void {
    const currentPath = window.location.pathname;
    
    if (this.state.previousPath !== currentPath) {
      // Track navigation
      if (this.state.previousPath) {
        trackNavigation(this.state.previousPath, currentPath);
      }
      
      // Track page view
      trackPageView(currentPath);
      
      // Update state
      this.setState({ previousPath: currentPath });
    }
  }

  render(): ReactElement {
    return <>{this.props.children}</>;
  }
}
