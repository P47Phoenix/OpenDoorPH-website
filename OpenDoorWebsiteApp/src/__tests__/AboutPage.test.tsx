import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { About } from '../pages/AboutPage/AboutPage';

// Mock the assets to avoid import issues in tests
jest.mock('../assets', () => ({
  TimelineIcon: 'test-timeline-icon.png',
  ChurchIcon: 'test-church-icon.png',
  PastorIcon: 'test-pastor-icon.png',
  ValuesIcon: 'test-values-icon.png',
  HistoryIcon: 'test-history-icon.png',
  LeadershipIcon: 'test-leadership-icon.png',
  HistoryScrollIcon: 'test-history-scroll-icon.png',
  ExternalLinkIcon: 'test-external-link-icon.png',
  CrossIcon: 'test-cross-icon.png',
  BibleIcon: 'test-bible-icon.png',
  CommunityServiceIcon: 'test-community-icon.png',
}));

// Mock analytics to avoid tracking in tests
jest.mock('../utils/analytics', () => ({
  trackAboutView: jest.fn(),
}));

// Mock usePageMeta to avoid side-effects
jest.mock('../hooks/usePageMeta', () => ({
  usePageMeta: jest.fn(),
}));

describe('AboutPage — Building Our Home heritage extension', () => {
  const renderPage = () =>
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

  test('renders the new heritage paragraph in the Building Our Home card', () => {
    renderPage();
    expect(screen.getByText(/Pleasant Hill itself/i)).toBeInTheDocument();
  });

  test('renders the UCM Knorpp Opera House external link with secure attributes', () => {
    renderPage();
    const link = screen.getByRole('link', { name: /Knorpp Opera House/i });
    expect(link).toHaveAttribute('href', 'https://historicmissouri.org/items/show/232');
    expect(link).toHaveAttribute('target', '_blank');
    const rel = link.getAttribute('rel') || '';
    expect(rel).toMatch(/noopener/);
    expect(rel).toMatch(/noreferrer/);
  });

  test('renders the Wikipedia NRHP external link with secure attributes', () => {
    renderPage();
    const link = screen.getByRole('link', { name: /Pleasant Hill Downtown Historic District/i });
    expect(link).toHaveAttribute(
      'href',
      'https://en.wikipedia.org/wiki/Pleasant_Hill_Downtown_Historic_District'
    );
    expect(link).toHaveAttribute('target', '_blank');
    const rel = link.getAttribute('rel') || '';
    expect(rel).toMatch(/noopener/);
    expect(rel).toMatch(/noreferrer/);
  });
});

// Photo alt string, byte-exact from PRD Rev 5 Amendment A1 (AC-43 / AC-44)
const PHOTO_ALT = 'The Open Door Full Gospel Church congregation gathered in the sanctuary';

describe('AboutPage — congregation photo (AC-44)', () => {
  const renderPage = () =>
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

  test('renders the photo once with the required attributes and no link', () => {
    renderPage();
    const img = screen.getByRole('img', { name: PHOTO_ALT });
    expect(img).toHaveAttribute('src', expect.stringMatching(/\/images\/congregation\.jpg$/));
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('decoding', 'async');
    expect(img).toHaveAttribute('width', '1424');
    expect(img).toHaveAttribute('height', '640');
    // PRD AC-44 mandates this exact assertion form (precedent: HomePage.test.tsx AC-43 block)
    // eslint-disable-next-line testing-library/no-node-access
    expect(img.closest('a')).toBeNull();
    expect(screen.getAllByRole('img', { name: /congregation/ })).toHaveLength(1);

    // TC-LW-6.11: figure wrapper classes and single child
    // eslint-disable-next-line testing-library/no-node-access
    const figure = img.closest('figure')!;
    expect(figure.className).toContain('mt-4 md:mt-6 max-w-3xl mx-auto');
    // eslint-disable-next-line testing-library/no-node-access
    expect(figure.children.length).toBe(1);
  });

  test('sits at the foot of Our History: after the timeline, before Leadership Legacy', () => {
    renderPage();
    const img = screen.getByRole('img', { name: PHOTO_ALT });
    // TC-LW-6.12: DOM order, three checks
    expect(
      screen.getByRole('heading', { level: 2, name: 'Our History' }).compareDocumentPosition(img) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      screen.getByAltText('Historical Timeline').compareDocumentPosition(img) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      img.compareDocumentPosition(screen.getByRole('heading', { level: 2, name: 'Leadership Legacy' })) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });
});
