import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Open Door website without crashing', () => {
  render(<App />);
  
  // Check for the main heading/logo with specific text
  expect(screen.getByRole('heading', { name: /Open Door Full Gospel church of pleasant hill mo/i })).toBeInTheDocument();
});

test('renders navigation elements', () => {
  render(<App />);
  
  // Check for main navigation elements by checking all links and finding the specific ones we need
  const allHomeLinks = screen.getAllByRole('link', { name: /Home/i });
  const allLocationLinks = screen.getAllByRole('link', { name: /Location/i });
  const allAboutLinks = screen.getAllByRole('link', { name: /About/i });
  
  // We expect at least one of each navigation link to exist
  expect(allHomeLinks.length).toBeGreaterThan(0);
  expect(allLocationLinks.length).toBeGreaterThan(0);
  expect(allAboutLinks.length).toBeGreaterThan(0);
  
  // Check that the main navigation links have the correct href
  expect(allHomeLinks.find(link => link.getAttribute('href') === '/opendoor')).toBeInTheDocument();
  expect(allLocationLinks.find(link => link.getAttribute('href') === '/opendoor/Home/Location')).toBeInTheDocument();
  expect(allAboutLinks.find(link => link.getAttribute('href') === '/opendoor/Home/About')).toBeInTheDocument();
});

test('renders Bible verse', () => {
  render(<App />);
  
  // Check for the Bible verse in the header
  expect(screen.getByText(/Brethren, if a man is overtaken/i)).toBeInTheDocument();
  expect(screen.getByText(/Galatians 6:1/i)).toBeInTheDocument();
});

test('renders church service information', () => {
  render(<App />);
  
  // Check for service time information in the sidebar
  expect(screen.getByText(/Morning Service/i)).toBeInTheDocument();
});

test('renders church name and branding', () => {
  render(<App />);
  
  // Check for the specific logo heading element
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  
  // Check for specific church name parts using regex for flexibility
  expect(screen.getByText('Door')).toBeInTheDocument();
  expect(screen.getByText('Gospel')).toBeInTheDocument();
  expect(screen.getByText(/church of pleasant hill mo/i)).toBeInTheDocument();
});
