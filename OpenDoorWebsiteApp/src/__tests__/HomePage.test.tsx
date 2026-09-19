import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { Main } from '../pages/HomePage/HomePage';

// Mock the assets to avoid import issues in tests (same set as LinkNavigation.test.tsx)
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
  ScheduleIcon: 'test-schedule-icon.png',
  FacebookIcon: 'test-facebook-icon.png',
  QuickMap: 'test-quick-map.png',
}));

// Mock analytics to avoid tracking in tests
jest.mock('../utils/analytics', () => ({
  trackLocationView: jest.fn(),
  trackExternalLink: jest.fn(),
  trackNavClick: jest.fn(),
  trackCtaClick: jest.fn(),
  trackSocialClick: jest.fn(),
  trackCalendarClick: jest.fn(),
}));

jest.mock('../hooks/usePageMeta');

// Photo alt string, byte-exact from PRD Rev 5 Amendment A1 (AC-43)
const PHOTO_ALT = 'The Open Door Full Gospel Church congregation gathered in the sanctuary';

const NKJV_VERSE =
  'Brethren, if a man is overtaken in any trespass, you who are spiritual restore such a one in a spirit of gentleness, considering yourself lest you also be tempted.';

// String literals copied from origin/master HomePage.tsx:21,24-25,35,38-42,55,62,68-69,75-76,87,94-95,101-102 (AC-19)
const MASTER_TEXT = [
  'Welcome to Open Door Full Gospel Church',
  'A community of faith committed to prayer, Bible study, and serving others with the love of Christ.',
  'Our Mission',
  'Open Door Full Gospel is committed to being a rock solid church through prayer, bible study, and community service. We strive to reach out to the community in any way we can. We provide solid foundations through biblically sound programs for youth, children, and Nursery. Our pastor, Dennis Gulley, brings the truth of the Bible and applies it to everyday life.',
  'Community Outreach',
  '2009 Clothes Drive: All clothes gathered were given away to the community free.',
  'Food Drive: All food gathered was donated to Harvesters. We helped pack boxes of bread for community pantries.',
  'Homeless Ministry: Worked with Uplift, providing coats, sleeping bags, clothes, and food to those in need.',
  'Ongoing Ministry',
  'Kansas City Rescue Mission: We work to prepare and serve hot meals to the homeless in our community.',
  'Community Partnerships: We continue our partnership with Uplift and other local organizations.',
  'Join Our Church Family',
  'These are just a few of the things going on at Open Door. Come by and experience the love of Christ. We would love to have you as part of our church family.',
];

const renderHome = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <Main />
    </MemoryRouter>
  );

describe('HomePage', () => {
  describe('church verse card (AC-15)', () => {
    test('renders the uppercase "Our church verse" label first', () => {
      renderHome();
      const label = screen.getByText('Our church verse');
      expect(label).toBeInTheDocument();
      expect(label.className).toContain('text-brick');
      expect(label.className).toContain('font-sans');
    });

    test('renders the NKJV verse as one contiguous blockquote text node', () => {
      renderHome();
      const q = screen.getByText(/^Brethren, if a man is overtaken in any trespass/);
      expect(q.tagName).toBe('BLOCKQUOTE');
      expect(q.textContent!.replace(/\s+/g, ' ').trim()).toBe(NKJV_VERSE);
    });

    test('renders the citation as a cite element', () => {
      renderHome();
      expect(screen.getByText('Galatians 6:1 (NKJV)').tagName).toBe('CITE');
    });

    test('renders exactly one "Read the study" link to the Scripture page', () => {
      renderHome();
      const link = screen.getByRole('link', { name: 'Read the study of Galatians 6:1' });
      expect(link).toHaveAttribute('href', '/opendoor/Home/Scripture');
      expect(link).toHaveTextContent('Read the study');
      expect(link).not.toHaveAttribute('target');
      expect(screen.getAllByRole('link', { name: /read the study/i })).toHaveLength(1);
      expect(link.getAttribute('aria-label')).not.toMatch(/about|home|location|visit us|learn more/i);
    });

    test('keeps the welcome h1 and places the verse card before it', () => {
      renderHome();
      const h1 = screen.getByRole('heading', { level: 1, name: /Welcome to Open Door Full Gospel Church/ });
      expect(h1).toBeInTheDocument();
      expect(
        screen.getByText('Our church verse').compareDocumentPosition(h1) & Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
    });
  });

  describe('content parity with master (AC-19)', () => {
    test('every master heading and paragraph string is present', () => {
      const { container } = renderHome();
      const t = container.textContent!.replace(/\s+/g, ' ');
      for (const s of MASTER_TEXT) {
        expect(t).toContain(s);
      }
    });

    test('keeps the "Visit Us" and "Learn More" CTAs (AC-18)', () => {
      renderHome();
      expect(screen.getByRole('link', { name: /visit us/i })).toHaveAttribute('href', '/opendoor/Home/Location');
      expect(screen.getByRole('link', { name: /^learn more$/i })).toHaveAttribute('href', '/opendoor/Home/About');
      expect(screen.getByRole('heading', { level: 2, name: 'Join Our Church Family' })).toBeInTheDocument();
    });
  });

  describe('congregation photo (AC-43)', () => {
    test('renders the photo once with the required attributes and no link', () => {
      renderHome();
      const img = screen.getByRole('img', { name: PHOTO_ALT });
      // Home uses a <picture> with a WebP source (congregation-hero.webp) and a
      // recompressed JPEG fallback (congregation-hero.jpg) since this is the LCP
      // candidate now that it's above the fold. About keeps the original
      // full-quality congregation.jpg with no <picture> wrapper.
      expect(img).toHaveAttribute('src', expect.stringMatching(/\/images\/congregation-hero\.jpg$/));
      // eslint-disable-next-line testing-library/no-node-access
      const source = img.closest('picture')?.querySelector('source');
      expect(source).toHaveAttribute('srcset', expect.stringMatching(/\/images\/congregation-hero\.webp$/));
      expect(source).toHaveAttribute('type', 'image/webp');
      // Eager + high priority since the photo now sits near the top of the
      // page (elder ruling 2026-09-18, moved above "Our Mission").
      expect(img).toHaveAttribute('loading', 'eager');
      expect(img).toHaveAttribute('fetchPriority', 'high');
      expect(img).toHaveAttribute('decoding', 'async');
      expect(img).toHaveAttribute('width', '1424');
      expect(img).toHaveAttribute('height', '640');
      // PRD AC-43 mandates this exact assertion form (precedent: AddToCalendarButton.test.tsx:247)
      // eslint-disable-next-line testing-library/no-node-access
      expect(img.closest('a')).toBeNull();
      expect(screen.getAllByRole('img', { name: /congregation/ })).toHaveLength(1);
      expect(img.className).toMatch(/\bw-full\b/);
      expect(img.className).toMatch(/\bh-auto\b/);

      const figure = screen.getByRole('figure');
      expect(figure).toContainElement(img);
      // TC-LW-5.15: the img is the figure's only child
      // eslint-disable-next-line testing-library/no-node-access
      expect(figure.childElementCount).toBe(1);
      expect(figure.className).toContain('max-w-3xl');
      expect(figure.className).toContain('mx-auto');
      // no caption: the img is the figure's only child and the figure carries no text
      expect(within(figure).getAllByRole('img')).toHaveLength(1);
      expect(figure.textContent).toBe('');
    });

    // Moved 2026-09-18 (elder ruling): now sits after the welcome heading,
    // before "Our Mission" — a visitor sees the congregation right after
    // the greeting, ahead of the mission text.
    test('sits after the welcome heading and before "Our Mission"', () => {
      renderHome();
      const img = screen.getByRole('img', { name: PHOTO_ALT });
      const h1 = screen.getByRole('heading', { level: 1, name: /Welcome to Open Door Full Gospel Church/ });
      expect(
        h1.compareDocumentPosition(img) & Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
      expect(
        img.compareDocumentPosition(screen.getByRole('heading', { level: 2, name: 'Our Mission' })) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
      expect(
        screen.getByText('Our church verse').compareDocumentPosition(img) & Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
    });
  });
});
