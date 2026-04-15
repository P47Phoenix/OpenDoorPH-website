/**
 * Church Event Data Model and Configuration
 *
 * Single source of truth for all church events displayed on the website.
 * Adding a new event requires only adding an entry to the EVENTS array --
 * no component code changes needed (NFR-6).
 *
 * Open Door Full Gospel Church, Pleasant Hill, MO ("PH" = Pleasant Hill)
 */

/**
 * Calendar platforms supported for Add-to-Calendar links.
 */
export type CalendarPlatform = 'google' | 'apple' | 'outlook';

/**
 * Church event data model (FR-2).
 */
export interface ChurchEvent {
  /** Unique identifier for the event (e.g., 'sunday-service') */
  id: string;

  /** Display title shown in sidebar card heading */
  title: string;

  /** Schedule description shown below the title (e.g., "Every Sunday") */
  subtitle: string;

  /** Day of the week (0=Sunday, 6=Saturday) */
  dayOfWeek: number;

  /** Display time string (e.g., "10:30 AM") */
  time: string;

  /** Event duration in minutes */
  duration: number;

  /** RFC 5545 RRULE string without "RRULE:" prefix */
  recurrenceRule: string;

  /** Full church address for calendar LOCATION field */
  location: string;

  /** Brief description for calendar entry DESCRIPTION field */
  description: string;

  /** Which calendar platform links to render */
  calendarPlatforms: CalendarPlatform[];

  /** IANA timezone string */
  timezone: string;

  /**
   * Reference start date for calendar entry DTSTART calculation.
   * Format: 'YYYY-MM-DDTHH:mm:ss' in the event's local timezone.
   */
  startDate: string;
}

export const CHURCH_LOCATION = 'Open Door Full Gospel Church, 135 S 1st St, Pleasant Hill, MO 64080';
export const CHURCH_TIMEZONE = 'America/Chicago';

export const EVENTS: ChurchEvent[] = [
  {
    id: 'sunday-service',
    title: 'Sunday Service',
    subtitle: 'Every Sunday',
    dayOfWeek: 0,
    time: '10:30 AM',
    duration: 90,
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=SU',
    location: CHURCH_LOCATION,
    description: 'Sunday Service at Open Door Full Gospel Church. All are welcome.',
    calendarPlatforms: ['google', 'apple', 'outlook'],
    timezone: CHURCH_TIMEZONE,
    startDate: '2026-04-12T10:30:00',
  },
  {
    id: 'woman-of-the-well',
    title: 'Woman of the Well',
    subtitle: 'Every 2nd Sunday',
    dayOfWeek: 0,
    time: '2:00 PM',
    duration: 90,
    recurrenceRule: 'FREQ=MONTHLY;BYDAY=2SU',
    location: CHURCH_LOCATION,
    description: 'Woman of the Well ministry at Open Door Full Gospel Church. All are welcome.',
    calendarPlatforms: ['google', 'apple', 'outlook'],
    timezone: CHURCH_TIMEZONE,
    startDate: '2026-04-12T14:00:00',
  },
];
