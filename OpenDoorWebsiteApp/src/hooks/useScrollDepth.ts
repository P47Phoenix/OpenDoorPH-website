/**
 * useScrollDepth Hook (Story 2.4)
 *
 * Tracks scroll depth milestones (25%, 50%, 75%, 100%) using IntersectionObserver.
 * Each milestone fires only once per page load and resets on navigation.
 */

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackClick } from '../utils/analytics';
import { GA_EVENTS } from '../config/analytics';

const MILESTONES = [25, 50, 75, 100];

export const useScrollDepth = (): void => {
  const location = useLocation();
  const firedRef = useRef<Set<number>>(new Set());
  const sentinelsRef = useRef<HTMLDivElement[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Reset milestones on navigation
    firedRef.current = new Set();

    // Clean up previous sentinels
    sentinelsRef.current.forEach((el) => el.remove());
    sentinelsRef.current = [];

    // Find the scrollable content area
    const main = document.querySelector('main.church-main');
    if (!main) return;

    // Create sentinel elements at each milestone percentage of the page
    const createSentinels = () => {
      const scrollHeight = main.scrollHeight;
      sentinelsRef.current.forEach((el) => el.remove());
      sentinelsRef.current = [];

      MILESTONES.forEach((pct) => {
        const sentinel = document.createElement('div');
        sentinel.style.position = 'absolute';
        sentinel.style.top = `${(pct / 100) * scrollHeight}px`;
        sentinel.style.height = '1px';
        sentinel.style.width = '1px';
        sentinel.style.pointerEvents = 'none';
        sentinel.style.opacity = '0';
        sentinel.dataset.scrollMilestone = String(pct);
        // main needs to be position relative for absolute children
        if (getComputedStyle(main).position === 'static') {
          (main as HTMLElement).style.position = 'relative';
        }
        main.appendChild(sentinel);
        sentinelsRef.current.push(sentinel);
      });
    };

    createSentinels();

    const pagePath = location.pathname;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const pct = Number(
            (entry.target as HTMLElement).dataset.scrollMilestone
          );
          if (pct && !firedRef.current.has(pct)) {
            firedRef.current.add(pct);
            trackClick(GA_EVENTS.SCROLL_DEPTH, {
              percent_scrolled: pct,
              page_path: pagePath,
            });
          }
        });
      },
      { threshold: 0 }
    );

    sentinelsRef.current.forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
      sentinelsRef.current.forEach((el) => el.remove());
      sentinelsRef.current = [];
    };
  }, [location.pathname]);
};
