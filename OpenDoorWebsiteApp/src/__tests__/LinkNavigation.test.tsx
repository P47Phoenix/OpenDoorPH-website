import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { Main } from '../pages/HomePage/HomePage';
import { Location } from '../pages/LocationPage/LocationPage';

// Mock the assets to avoid import issues in tests
jest.mock('../assets', () => ({
  CrossIcon: 'test-cross-icon.png',
  HeartIcon: 'test-heart-icon.png',
  BibleIcon: 'test-bible-icon.png',
  CommunityServiceIcon: 'test-community-icon.png',
  WelcomeBanner: 'test-welcome-banner.png',
  MapMarkerIcon: 'test-map-marker-icon.png',
  DirectionsIcon: 'test-directions-icon.png',
  AddressIcon: 'test-address-icon.png',
  CarIcon: 'test-car-icon.png',
}));

// Mock analytics to avoid tracking in tests
jest.mock('../utils/analytics', () => ({
  trackLocationView: jest.fn(),
  trackExternalLink: jest.fn(),
}));

describe('Link Navigation Tests', () => {
  const renderWithRouter = (component: React.ReactElement, initialEntries = ['/']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        {component}
      </MemoryRouter>
    );
  };

  describe('HomePage Links', () => {
    test('should render Visit Us button with correct path', () => {
      renderWithRouter(<Main />);
      
      const visitUsLink = screen.getByRole('link', { name: /visit us/i });
      expect(visitUsLink).toBeInTheDocument();
      expect(visitUsLink).toHaveAttribute('href', '/opendoor/Home/Location');
    });

    test('should render Learn More button with correct path', () => {
      renderWithRouter(<Main />);
      
      const learnMoreLink = screen.getByRole('link', { name: /learn more/i });
      expect(learnMoreLink).toBeInTheDocument();
      expect(learnMoreLink).toHaveAttribute('href', '/opendoor/Home/About');
    });

    test('should use Link components instead of anchor tags', () => {
      renderWithRouter(<Main />);
      
      // Verify these are React Router Links (they should not have target="_blank")
      const visitUsLink = screen.getByRole('link', { name: /visit us/i });
      const learnMoreLink = screen.getByRole('link', { name: /learn more/i });
      
      expect(visitUsLink).not.toHaveAttribute('target');
      expect(learnMoreLink).not.toHaveAttribute('target');
    });
  });

  describe('LocationPage Links', () => {
    test('should render About Our Church link with correct path', () => {
      renderWithRouter(<Location />);
      
      const aboutLink = screen.getByRole('link', { name: /about our church/i });
      expect(aboutLink).toBeInTheDocument();
      expect(aboutLink).toHaveAttribute('href', '/opendoor/Home/About');
    });

    test('should use Link component instead of anchor tag', () => {
      renderWithRouter(<Location />);
      
      const aboutLink = screen.getByRole('link', { name: /about our church/i });
      expect(aboutLink).not.toHaveAttribute('target');
    });
  });

  describe('Link Accessibility', () => {
    test('homepage links should be accessible', () => {
      renderWithRouter(<Main />);
      
      const visitUsLink = screen.getByRole('link', { name: /visit us/i });
      const learnMoreLink = screen.getByRole('link', { name: /learn more/i });
      
      expect(visitUsLink).toBeVisible();
      expect(learnMoreLink).toBeVisible();
    });

    test('location page links should be accessible', () => {
      renderWithRouter(<Location />);
      
      const aboutLink = screen.getByRole('link', { name: /about our church/i });
      expect(aboutLink).toBeVisible();
    });
  });

  describe('Previously Broken Links Regression Tests', () => {
    test('Homepage Visit Us button should use relative path (not hardcoded href)', () => {
      renderWithRouter(<Main />);
      
      const visitUsLink = screen.getByRole('link', { name: /visit us/i });
      // This should be a React Router Link with proper relative path
      expect(visitUsLink).toHaveAttribute('href', '/opendoor/Home/Location');
      // Should not be an absolute URL that would bypass the router
      expect(visitUsLink.getAttribute('href')).not.toMatch(/^https?:\/\//);
    });

    test('Homepage Learn More button should use relative path (not hardcoded href)', () => {
      renderWithRouter(<Main />);
      
      const learnMoreLink = screen.getByRole('link', { name: /learn more/i });
      expect(learnMoreLink).toHaveAttribute('href', '/opendoor/Home/About');
      expect(learnMoreLink.getAttribute('href')).not.toMatch(/^https?:\/\//);
    });

    test('Location About Our Church link should use relative path (not hardcoded href)', () => {
      renderWithRouter(<Location />);
      
      const aboutLink = screen.getByRole('link', { name: /about our church/i });
      expect(aboutLink).toHaveAttribute('href', '/opendoor/Home/About');
      expect(aboutLink.getAttribute('href')).not.toMatch(/^https?:\/\//);
    });
  });
});
