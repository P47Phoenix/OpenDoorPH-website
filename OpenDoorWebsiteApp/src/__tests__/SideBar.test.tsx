/**
 * E-2: SideBar EventCard Rendering Tests
 *
 * Tests for the refactored SideBar rendering from EVENTS config.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import SideBar from '../components/layout/SideBar';

// Mock analytics
jest.mock('../utils/analytics', () => ({
  trackNavClick: jest.fn(),
  trackCtaClick: jest.fn(),
  trackSocialClick: jest.fn(),
  trackCalendarClick: jest.fn(),
}));

// Mock calendar utilities
jest.mock('../utils/calendarLinks', () => ({
  generateGoogleCalendarUrl: jest.fn(() => 'https://calendar.google.com/mock'),
  downloadIcsFile: jest.fn(),
}));

// Mock SVG imports
jest.mock('../assets', () => ({
  ScheduleIcon: 'schedule-icon.svg',
  FacebookIcon: 'facebook-icon.svg',
  QuickMap: 'quick-map.svg',
}));

// Mock config/events with a getter that returns either the override (when
// set on globalThis.__mockEventsOverride) or the real EVENTS array from the
// actual module. This lets individual tests swap in an empty array without
// needing jest.resetModules() or jest.isolateModules(), both of which would
// re-load React and trigger "invalid hook call" errors.
jest.mock('../config/events', () => {
  const actual = jest.requireActual('../config/events');
  return {
    ...actual,
    get EVENTS() {
      const override = (globalThis as { __mockEventsOverride?: unknown[] })
        .__mockEventsOverride;
      return override !== undefined ? override : actual.EVENTS;
    },
  };
});

beforeEach(() => {
  // Reset override before each test so the full EVENTS array is used by default.
  delete (globalThis as { __mockEventsOverride?: unknown[] }).__mockEventsOverride;
});

const renderSideBar = () =>
  render(
    <MemoryRouter>
      <SideBar />
    </MemoryRouter>
  );

describe('E-2: SideBar EventCard Rendering', () => {
  // E-2.2: Schedule section heading renders
  test('renders "Schedule" section heading', () => {
    renderSideBar();
    const heading = screen.getByText('Schedule');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H3');
  });

  // E-2.4: Sunday Service card content
  test('renders Sunday Service card with correct content', () => {
    renderSideBar();
    expect(screen.getByText('Sunday Service')).toBeInTheDocument();
    expect(screen.getByText('Every Sunday')).toBeInTheDocument();
    expect(screen.getByText('10:30 AM')).toBeInTheDocument();
  });

  // E-2.5: Woman of the Well card content
  test('renders Woman of the Well card with correct content', () => {
    renderSideBar();
    expect(screen.getByText('Woman of the Well')).toBeInTheDocument();
    expect(screen.getByText('Every 2nd Sunday')).toBeInTheDocument();
    expect(screen.getByText('2:00 PM')).toBeInTheDocument();
  });

  // E-2.6: AddToCalendarButton present on each card
  test('renders AddToCalendarButton for each event', () => {
    renderSideBar();
    const calendarButtons = screen.getAllByText('Add to Calendar');
    expect(calendarButtons).toHaveLength(2);
  });

  // E-2.7: Heading hierarchy -- h3 then h4
  test('uses correct heading hierarchy (h3 for section, h4 for events)', () => {
    renderSideBar();
    const scheduleHeading = screen.getByText('Schedule');
    expect(scheduleHeading.tagName).toBe('H3');

    const sundayHeading = screen.getByText('Sunday Service');
    expect(sundayHeading.tagName).toBe('H4');

    const wotwHeading = screen.getByText('Woman of the Well');
    expect(wotwHeading.tagName).toBe('H4');
  });

  // E-2.12: No Philippines reference
  test('no Philippines reference in rendered output', () => {
    const { container } = renderSideBar();
    expect(container.textContent?.toLowerCase()).not.toContain('philippines');
  });

  // Verify aria-labels for both AddToCalendar buttons
  test('both AddToCalendarButtons have correct aria-labels', () => {
    renderSideBar();
    expect(screen.getByLabelText('Add Sunday Service to your calendar')).toBeInTheDocument();
    expect(screen.getByLabelText('Add Woman of the Well to your calendar')).toBeInTheDocument();
  });

  // Other sidebar sections still render
  test('Welcome section still renders', () => {
    renderSideBar();
    expect(screen.getByText('Welcome')).toBeInTheDocument();
  });

  test('Facebook section still renders', () => {
    renderSideBar();
    expect(screen.getByText('Follow Us on Facebook')).toBeInTheDocument();
  });

  // E-2 AC-10: Empty EVENTS array renders gracefully
  test('renders gracefully when EVENTS array is empty', () => {
    // Override EVENTS to an empty array via the shared mock getter.
    (globalThis as { __mockEventsOverride?: unknown[] }).__mockEventsOverride =
      [];

    renderSideBar();

    // Schedule heading should still render
    const heading = screen.getByText('Schedule');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H3');

    // No event cards should be present
    expect(screen.queryByText('Sunday Service')).not.toBeInTheDocument();
    expect(screen.queryByText('Woman of the Well')).not.toBeInTheDocument();

    // No AddToCalendar buttons
    expect(screen.queryByText('Add to Calendar')).not.toBeInTheDocument();
  });
});
