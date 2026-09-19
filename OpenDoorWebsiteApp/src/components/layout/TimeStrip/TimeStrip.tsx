import React from 'react';
import { Link } from 'react-router-dom';
import { EVENTS } from '../../../config/events';

/**
 * Mobile-only sticky strip under the masthead: Sunday service time plus a
 * Directions link. Mounted as a sibling of <Header /> in MasterLayout. Since
 * the header itself became sticky (elder ruling 2026-09-18, floating nav),
 * this strip sticks at `top-[65px]` — the header's mobile min-height (4rem) plus its 1px border — so
 * it stacks directly under the header instead of overlapping it. Hidden at
 * the `md` breakpoint (AC-9).
 */
const TimeStrip: React.FC = () => (
  <div
    data-testid="time-strip"
    role="region"
    aria-label="Service time"
    className="md:hidden sticky top-[65px] z-30 bg-sage text-white flex font-sans text-sm font-semibold"
  >
    <span className="flex-1 min-h-[44px] flex items-center justify-center">Sun {EVENTS[0].time}</span>
    <Link
      to="/opendoor/Home/Location"
      className="flex-1 min-h-[44px] flex items-center justify-center gap-1.5 border-l border-sage-dark transition-colors duration-150 motion-reduce:transition-none touch-manipulation hover:bg-sage-dark hover:underline active:bg-sage-dark focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sage focus:ring-inset"
    >
      <svg
        aria-hidden="true"
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      Directions
    </Link>
  </div>
);

export default TimeStrip;
