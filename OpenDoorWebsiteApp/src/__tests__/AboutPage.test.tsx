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
