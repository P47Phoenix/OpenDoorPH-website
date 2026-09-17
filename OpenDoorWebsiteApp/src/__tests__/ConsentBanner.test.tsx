import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConsentBanner from '../components/ConsentBanner/ConsentBanner';

// Mock the gtag side effects only; keep the real localStorage reader (getStoredConsent).
// CRA's jest config sets resetMocks: true, so factory implementations would be wiped per test.
jest.mock('../utils/analytics', () => ({
  ...jest.requireActual('../utils/analytics'),
  updateConsent: jest.fn(),
  trackNavClick: jest.fn(),
  trackCtaClick: jest.fn(),
  trackSocialClick: jest.fn(),
  trackCalendarClick: jest.fn(),
}));

const ACCEPT = { name: "That's Fine" };
const DECLINE = { name: 'No Thanks' };

describe('ConsentBanner', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders both buttons when consent is unknown', async () => {
    render(<ConsentBanner />);
    expect(await screen.findByRole('button', DECLINE)).toBeInTheDocument();
    expect(await screen.findByRole('button', ACCEPT)).toBeInTheDocument();
  });

  test("clicking That's Fine stores granted", async () => {
    render(<ConsentBanner />);
    fireEvent.click(await screen.findByRole('button', ACCEPT));
    expect(localStorage.getItem('analytics-consent')).toBe('granted');
  });

  test('clicking No Thanks stores denied', async () => {
    render(<ConsentBanner />);
    fireEvent.click(await screen.findByRole('button', DECLINE));
    expect(localStorage.getItem('analytics-consent')).toBe('denied');
  });

  test('accept button carries sage tokens with no legacy or alpha classes; decline has a solid sage border', async () => {
    render(<ConsentBanner />);
    const cls = (await screen.findByRole('button', ACCEPT)).className;
    expect(cls).toContain('bg-sage');
    expect(cls).toContain('text-white');
    expect(cls).not.toContain('church-');
    expect(cls).not.toContain('/90');

    const d = (await screen.findByRole('button', DECLINE)).className;
    expect(d).toMatch(/(^|\s)border-sage(\s|$)/);
    expect(d).toMatch(/(^|\s)border(\s|$)/);
    expect(d).not.toMatch(/border-rule/);
  });

  test.each(['granted', 'denied'])('renders nothing when analytics-consent is pre-set to %s', async (value) => {
    localStorage.setItem('analytics-consent', value);
    render(<ConsentBanner />);
    await waitFor(() => expect(screen.queryByRole('button', ACCEPT)).toBeNull());
    expect(screen.queryByRole('button', DECLINE)).toBeNull();
  });
});
