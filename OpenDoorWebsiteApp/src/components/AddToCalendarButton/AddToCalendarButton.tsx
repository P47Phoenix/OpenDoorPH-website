import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChurchEvent, CalendarPlatform } from '../../config/events';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../../utils/calendarLinks';
import { trackCalendarClick } from '../../utils/analytics';

interface AddToCalendarButtonProps {
  /** The church event to generate calendar links for */
  event: ChurchEvent;
}

/**
 * Chevron icon for dropdown indicator.
 */
const ChevronDown: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 6l4 4 4-4" />
  </svg>
);

/**
 * AddToCalendarButton -- dropdown button for adding church events to calendars.
 *
 * Supports Google Calendar (URL), Apple Calendar (.ics), and Outlook (.ics).
 * Full WAI-ARIA Menu Button pattern with keyboard navigation (E-5).
 */
const AddToCalendarButton: React.FC<AddToCalendarButtonProps> = ({ event }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const menuId = `calendar-menu-${event.id}`;
  const buttonId = `calendar-btn-${event.id}`;

  const platforms: { key: CalendarPlatform; label: string }[] = [
    { key: 'google', label: 'Google Calendar' },
    { key: 'apple', label: 'Apple Calendar' },
    { key: 'outlook', label: 'Outlook' },
  ];

  const close = useCallback((restoreFocus = true) => {
    setIsOpen(false);
    setFocusedIndex(-1);
    if (restoreFocus) {
      // Defer focus restore to after state update
      setTimeout(() => triggerRef.current?.focus(), 0);
    }
  }, []);

  const handlePlatformClick = useCallback(
    (platform: CalendarPlatform) => {
      trackCalendarClick(event.title, platform, 'sidebar');

      if (platform === 'google') {
        const url = generateGoogleCalendarUrl(event);
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        downloadIcsFile(event);
      }

      close();
    },
    [event, close]
  );

  // Focus the item at focusedIndex when it changes
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && focusedIndex < platforms.length) {
      itemRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex, isOpen, platforms.length]);

  // Click outside and Escape handlers -- attach when open, clean up when closed
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        close(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, close]);

  const handleTriggerClick = () => {
    if (isOpen) {
      close();
    } else {
      setIsOpen(true);
      setFocusedIndex(0);
    }
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setFocusedIndex(0);
      } else {
        close();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setFocusedIndex(0);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setFocusedIndex(platforms.length - 1);
      }
    }
  };

  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % platforms.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + platforms.length) % platforms.length);
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(platforms.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0) {
          handlePlatformClick(platforms[focusedIndex].key);
        }
        break;
      case 'Tab':
        // Let Tab close the menu and move focus naturally
        close(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        id={buttonId}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={menuId}
        aria-label={`Add ${event.title} to your calendar`}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        className={`inline-flex items-center justify-center gap-2 w-full px-4 py-2.5
          ${isOpen ? 'bg-green-500/20' : 'bg-green-500/10'} text-green-700
          text-sm font-medium rounded-lg border border-green-500/20
          hover:bg-green-500/20 transition-colors duration-200
          motion-reduce:transition-none touch-manipulation min-h-[44px]
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
      >
        Add to Calendar
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 motion-reduce:transition-none ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label="Calendar options"
          onKeyDown={handleMenuKeyDown}
          className="absolute left-0 right-0 mt-1 z-10 bg-white rounded-lg shadow-lg border border-stone-200 py-1 motion-reduce:transition-none"
        >
          {platforms.map((platform, index) => (
            <button
              key={platform.key}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              role="menuitem"
              tabIndex={-1}
              onClick={() => handlePlatformClick(platform.key)}
              className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-stone-700
                hover:bg-stone-50 transition-colors duration-150 motion-reduce:transition-none
                touch-manipulation min-h-[44px] focus:outline-none focus:bg-stone-100"
            >
              {platform.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddToCalendarButton;
