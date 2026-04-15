/**
 * E-3 + E-5: AddToCalendarButton Component Tests
 *
 * Tests for the dropdown button, accessibility, and keyboard navigation.
 */

import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddToCalendarButton from '../components/AddToCalendarButton';
import { ChurchEvent } from '../config/events';

// Mock analytics
jest.mock('../utils/analytics', () => ({
  trackCalendarClick: jest.fn(),
}));

// Mock calendar link utilities
jest.mock('../utils/calendarLinks', () => ({
  generateGoogleCalendarUrl: jest.fn(() => 'https://calendar.google.com/calendar/render?mock=true'),
  downloadIcsFile: jest.fn(),
}));

const sundayService: ChurchEvent = {
  id: 'sunday-service',
  title: 'Sunday Service',
  subtitle: 'Every Sunday',
  dayOfWeek: 0,
  time: '10:30 AM',
  duration: 90,
  recurrenceRule: 'FREQ=WEEKLY;BYDAY=SU',
  location: 'Open Door Full Gospel Church, 135 S 1st St, Pleasant Hill, MO 64080',
  description: 'Sunday Service at Open Door Full Gospel Church. All are welcome.',
  calendarPlatforms: ['google', 'apple', 'outlook'],
  timezone: 'America/Chicago',
  startDate: '2026-04-12T10:30:00',
};

const wotwEvent: ChurchEvent = {
  id: 'woman-of-the-well',
  title: 'Woman of the Well',
  subtitle: 'Every 2nd Sunday',
  dayOfWeek: 0,
  time: '2:00 PM',
  duration: 90,
  recurrenceRule: 'FREQ=MONTHLY;BYDAY=2SU',
  location: 'Open Door Full Gospel Church, 135 S 1st St, Pleasant Hill, MO 64080',
  description: 'Woman of the Well ministry at Open Door Full Gospel Church. All are welcome.',
  calendarPlatforms: ['google', 'apple', 'outlook'],
  timezone: 'America/Chicago',
  startDate: '2026-04-12T14:00:00',
};

describe('E-3: AddToCalendarButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // E-3.2: Button renders with correct label
  test('renders button with "Add to Calendar" text', () => {
    render(<AddToCalendarButton event={sundayService} />);
    expect(screen.getByText('Add to Calendar')).toBeInTheDocument();
  });

  // E-3.3: aria-label includes event title
  test('aria-label includes event title for Sunday Service', () => {
    render(<AddToCalendarButton event={sundayService} />);
    expect(screen.getByLabelText('Add Sunday Service to your calendar')).toBeInTheDocument();
  });

  test('aria-label includes event title for Woman of the Well', () => {
    render(<AddToCalendarButton event={wotwEvent} />);
    expect(screen.getByLabelText('Add Woman of the Well to your calendar')).toBeInTheDocument();
  });

  // E-3.4: Dropdown initially closed
  test('dropdown is initially closed', () => {
    render(<AddToCalendarButton event={sundayService} />);
    const button = screen.getByLabelText('Add Sunday Service to your calendar');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  // E-3.5: Click opens dropdown
  test('clicking button opens dropdown', () => {
    render(<AddToCalendarButton event={sundayService} />);
    const button = screen.getByLabelText('Add Sunday Service to your calendar');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  // E-3.6: Three platform options rendered
  test('dropdown shows three calendar options', () => {
    render(<AddToCalendarButton event={sundayService} />);
    fireEvent.click(screen.getByText('Add to Calendar'));

    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems).toHaveLength(3);
    expect(screen.getByText('Google Calendar')).toBeInTheDocument();
    expect(screen.getByText('Apple Calendar')).toBeInTheDocument();
    expect(screen.getByText('Outlook')).toBeInTheDocument();
  });

  // E-3.7: Dropdown has menu role
  test('dropdown has role="menu" and aria-label', () => {
    render(<AddToCalendarButton event={sundayService} />);
    fireEvent.click(screen.getByText('Add to Calendar'));

    const menu = screen.getByRole('menu');
    expect(menu).toHaveAttribute('aria-label', 'Calendar options');
  });

  // E-3.8: Dismiss -- Escape key
  test('Escape key closes dropdown', () => {
    render(<AddToCalendarButton event={sundayService} />);
    const button = screen.getByLabelText('Add Sunday Service to your calendar');
    fireEvent.click(button);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  // E-3.9: Dismiss -- click outside
  test('clicking outside closes dropdown', () => {
    render(
      <div>
        <span data-testid="outside">Outside</span>
        <AddToCalendarButton event={sundayService} />
      </div>
    );
    fireEvent.click(screen.getByText('Add to Calendar'));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  // E-3.10: Dismiss -- toggle click
  test('clicking trigger again closes dropdown', () => {
    render(<AddToCalendarButton event={sundayService} />);
    const button = screen.getByText('Add to Calendar');
    fireEvent.click(button);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  // E-3.11: Dismiss -- option selected
  test('selecting an option closes dropdown', () => {
    const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    render(<AddToCalendarButton event={sundayService} />);
    fireEvent.click(screen.getByText('Add to Calendar'));

    fireEvent.click(screen.getByText('Google Calendar'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    windowOpenSpy.mockRestore();
  });

  // E-3.12/E-3.13: Google Calendar action fires
  test('Google Calendar option calls window.open', () => {
    const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    render(<AddToCalendarButton event={sundayService} />);
    fireEvent.click(screen.getByText('Add to Calendar'));
    fireEvent.click(screen.getByText('Google Calendar'));

    expect(windowOpenSpy).toHaveBeenCalledWith(
      expect.stringContaining('calendar.google.com'),
      '_blank',
      'noopener,noreferrer'
    );
    windowOpenSpy.mockRestore();
  });

  // E-3.14: .ics download triggers
  test('Apple Calendar option triggers ICS download', () => {
    const { downloadIcsFile } = require('../utils/calendarLinks');
    render(<AddToCalendarButton event={sundayService} />);
    fireEvent.click(screen.getByText('Add to Calendar'));
    fireEvent.click(screen.getByText('Apple Calendar'));

    expect(downloadIcsFile).toHaveBeenCalledWith(sundayService);
  });

  test('Outlook option triggers ICS download', () => {
    const { downloadIcsFile } = require('../utils/calendarLinks');
    render(<AddToCalendarButton event={sundayService} />);
    fireEvent.click(screen.getByText('Add to Calendar'));
    fireEvent.click(screen.getByText('Outlook'));

    expect(downloadIcsFile).toHaveBeenCalledWith(sundayService);
  });

  // E-5.8: aria-haspopup present
  test('trigger button has aria-haspopup="true"', () => {
    render(<AddToCalendarButton event={sundayService} />);
    const button = screen.getByLabelText('Add Sunday Service to your calendar');
    expect(button).toHaveAttribute('aria-haspopup', 'true');
  });

  // E-5.7: aria-expanded reflects state
  test('aria-expanded reflects open/closed state', () => {
    render(<AddToCalendarButton event={sundayService} />);
    const button = screen.getByLabelText('Add Sunday Service to your calendar');
    expect(button).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  // E-5.10: role="menu" on dropdown
  test('dropdown container has role="menu"', () => {
    render(<AddToCalendarButton event={sundayService} />);
    fireEvent.click(screen.getByText('Add to Calendar'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  // E-5.11: role="menuitem" on each option
  test('each option has role="menuitem"', () => {
    render(<AddToCalendarButton event={sundayService} />);
    fireEvent.click(screen.getByText('Add to Calendar'));
    const items = screen.getAllByRole('menuitem');
    expect(items).toHaveLength(3);
  });

  // E-5.15: Decorative chevron has aria-hidden
  test('chevron SVG has aria-hidden', () => {
    render(<AddToCalendarButton event={sundayService} />);
    const svg = screen.getByText('Add to Calendar').closest('button')?.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  // E-5.2: Enter opens dropdown
  test('Enter key opens dropdown', () => {
    render(<AddToCalendarButton event={sundayService} />);
    const button = screen.getByLabelText('Add Sunday Service to your calendar');
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  // E-5.3: Space opens dropdown
  test('Space key opens dropdown', () => {
    render(<AddToCalendarButton event={sundayService} />);
    const button = screen.getByLabelText('Add Sunday Service to your calendar');
    fireEvent.keyDown(button, { key: ' ' });
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  // E-3.17: Touch target minimum size
  test('trigger button has min-h-[44px] class for touch targets', () => {
    render(<AddToCalendarButton event={sundayService} />);
    const button = screen.getByLabelText('Add Sunday Service to your calendar');
    expect(button.className).toContain('min-h-[44px]');
  });

  test('menu items have min-h-[44px] class for touch targets', () => {
    render(<AddToCalendarButton event={sundayService} />);
    fireEvent.click(screen.getByText('Add to Calendar'));
    const items = screen.getAllByRole('menuitem');
    items.forEach((item) => {
      expect(item.className).toContain('min-h-[44px]');
    });
  });

  // E-5: motion-reduce classes present
  test('motion-reduce classes are applied', () => {
    render(<AddToCalendarButton event={sundayService} />);
    const button = screen.getByLabelText('Add Sunday Service to your calendar');
    expect(button.className).toContain('motion-reduce:transition-none');
  });

  // E-5 F-3: ArrowDown moves focus to next menu item (with wrapping)
  test('ArrowDown moves focus to next menu item', () => {
    render(<AddToCalendarButton event={sundayService} />);
    const button = screen.getByLabelText('Add Sunday Service to your calendar');

    // Open menu via click (focuses first item)
    fireEvent.click(button);
    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems[0]).toHaveFocus();

    // ArrowDown to second item
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' });
    expect(menuItems[1]).toHaveFocus();

    // ArrowDown to third item
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' });
    expect(menuItems[2]).toHaveFocus();

    // ArrowDown wraps to first item
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' });
    expect(menuItems[0]).toHaveFocus();
  });

  // E-5 F-3: ArrowUp moves focus to previous menu item (with wrapping)
  test('ArrowUp moves focus to previous menu item', () => {
    render(<AddToCalendarButton event={sundayService} />);
    const button = screen.getByLabelText('Add Sunday Service to your calendar');

    // Open menu via click (focuses first item)
    fireEvent.click(button);
    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems[0]).toHaveFocus();

    // ArrowUp wraps to last item
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowUp' });
    expect(menuItems[2]).toHaveFocus();

    // ArrowUp to second item
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowUp' });
    expect(menuItems[1]).toHaveFocus();
  });

  // E-5 F-3: Home key moves focus to first menu item
  test('Home key moves focus to first menu item', () => {
    render(<AddToCalendarButton event={sundayService} />);
    const button = screen.getByLabelText('Add Sunday Service to your calendar');

    // Open and navigate to last item
    fireEvent.click(button);
    const menuItems = screen.getAllByRole('menuitem');
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'End' });
    expect(menuItems[2]).toHaveFocus();

    // Home jumps to first
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Home' });
    expect(menuItems[0]).toHaveFocus();
  });

  // E-5 F-3: End key moves focus to last menu item
  test('End key moves focus to last menu item', () => {
    render(<AddToCalendarButton event={sundayService} />);
    const button = screen.getByLabelText('Add Sunday Service to your calendar');

    // Open menu (focuses first item)
    fireEvent.click(button);
    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems[0]).toHaveFocus();

    // End jumps to last
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'End' });
    expect(menuItems[2]).toHaveFocus();
  });

  // E-5 F-3: Tab key closes the menu
  test('Tab key closes the menu', () => {
    render(<AddToCalendarButton event={sundayService} />);
    const button = screen.getByLabelText('Add Sunday Service to your calendar');

    // Open menu
    fireEvent.click(button);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    // Tab closes the menu without restoring focus to trigger
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Tab' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  // Analytics tracking
  test('tracks calendar click for each platform', () => {
    const { trackCalendarClick } = require('../utils/analytics');
    const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);

    render(<AddToCalendarButton event={sundayService} />);

    // Google Calendar
    fireEvent.click(screen.getByText('Add to Calendar'));
    fireEvent.click(screen.getByText('Google Calendar'));
    expect(trackCalendarClick).toHaveBeenCalledWith('Sunday Service', 'google', 'sidebar');

    // Apple Calendar
    fireEvent.click(screen.getByText('Add to Calendar'));
    fireEvent.click(screen.getByText('Apple Calendar'));
    expect(trackCalendarClick).toHaveBeenCalledWith('Sunday Service', 'apple', 'sidebar');

    // Outlook
    fireEvent.click(screen.getByText('Add to Calendar'));
    fireEvent.click(screen.getByText('Outlook'));
    expect(trackCalendarClick).toHaveBeenCalledWith('Sunday Service', 'outlook', 'sidebar');

    windowOpenSpy.mockRestore();
  });
});
