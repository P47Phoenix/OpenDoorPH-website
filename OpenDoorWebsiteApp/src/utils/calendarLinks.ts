/**
 * Calendar Link Utilities
 *
 * Generates Google Calendar URLs and RFC 5545 .ics files for church events.
 * All generation is client-side only (NFR-2). No third-party dependencies (NFR-1).
 *
 * Open Door Full Gospel Church, Pleasant Hill, MO ("PH" = Pleasant Hill)
 */

import { ChurchEvent } from '../config/events';

/**
 * Parse startDate string and return local datetime components.
 */
function parseStartDate(startDate: string): {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const [datePart, timePart] = startDate.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes, seconds] = (timePart || '00:00:00').split(':').map(Number);
  return { year, month, day, hours, minutes, seconds: seconds || 0 };
}

const pad = (n: number) => n.toString().padStart(2, '0');

/**
 * Format date components as YYYYMMDDTHHmmss (local time, no Z suffix).
 */
function formatDateTime(
  year: number,
  month: number,
  day: number,
  hours: number,
  minutes: number,
  seconds: number
): string {
  return `${year}${pad(month)}${pad(day)}T${pad(hours)}${pad(minutes)}${pad(seconds)}`;
}

/**
 * Calculate end time components from start time and duration in minutes.
 */
function calculateEndTime(
  hours: number,
  minutes: number,
  duration: number
): { endHours: number; endMinutes: number } {
  const totalMinutes = hours * 60 + minutes + duration;
  return {
    endHours: Math.floor(totalMinutes / 60),
    endMinutes: totalMinutes % 60,
  };
}

/**
 * Generate a Google Calendar URL for a church event (FR-4).
 *
 * Uses local time format with ctz parameter so Google Calendar
 * interprets the time in America/Chicago timezone.
 */
export function generateGoogleCalendarUrl(event: ChurchEvent): string {
  const { year, month, day, hours, minutes, seconds } = parseStartDate(event.startDate);
  const { endHours, endMinutes } = calculateEndTime(hours, minutes, event.duration);

  const startStr = formatDateTime(year, month, day, hours, minutes, seconds);
  const endStr = formatDateTime(year, month, day, endHours, endMinutes, seconds);

  const title = `${event.title} - Open Door Full Gospel Church`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startStr}/${endStr}`,
    location: event.location,
    details: event.description,
    ctz: event.timezone,
  });

  // Add recur param with RRULE: prefix
  const recur = `RRULE:${event.recurrenceRule}`;

  return `https://calendar.google.com/calendar/render?${params.toString()}&recur=${encodeURIComponent(recur)}`;
}

/**
 * Fold lines longer than 75 octets per RFC 5545.
 * Continuation lines start with a single space.
 */
function foldLine(line: string): string {
  if (line.length <= 75) return line;

  const parts: string[] = [];
  parts.push(line.substring(0, 75));
  let remaining = line.substring(75);

  while (remaining.length > 0) {
    // Continuation line: space + up to 74 chars (space counts toward 75)
    parts.push(' ' + remaining.substring(0, 74));
    remaining = remaining.substring(74);
  }

  return parts.join('\r\n');
}

/**
 * Generate RFC 5545 .ics file content for a church event (FR-5).
 * Includes VTIMEZONE for America/Chicago with STANDARD and DAYLIGHT transitions.
 * Uses TZID-qualified DTSTART/DTEND -- NO naive UTC timestamps.
 */
export function generateIcsContent(event: ChurchEvent): string {
  const { year, month, day, hours, minutes, seconds } = parseStartDate(event.startDate);
  const { endHours, endMinutes } = calculateEndTime(hours, minutes, event.duration);

  const startLocal = formatDateTime(year, month, day, hours, minutes, seconds);
  const endLocal = formatDateTime(year, month, day, endHours, endMinutes, seconds);

  const title = `${event.title} - Open Door Full Gospel Church`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Open Door Full Gospel Church//Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE',
    'TZID:America/Chicago',
    'BEGIN:STANDARD',
    'DTSTART:19701101T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU',
    'TZOFFSETFROM:-0500',
    'TZOFFSETTO:-0600',
    'TZNAME:CST',
    'END:STANDARD',
    'BEGIN:DAYLIGHT',
    'DTSTART:19700308T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU',
    'TZOFFSETFROM:-0600',
    'TZOFFSETTO:-0500',
    'TZNAME:CDT',
    'END:DAYLIGHT',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    `UID:${event.id}@opendoorphchurch.com`,
    `DTSTART;TZID=America/Chicago:${startLocal}`,
    `DTEND;TZID=America/Chicago:${endLocal}`,
    `RRULE:${event.recurrenceRule}`,
    `SUMMARY:${title}`,
    `LOCATION:${event.location}`,
    `DESCRIPTION:${event.description}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  // Fold long lines and join with CRLF
  return lines.map(foldLine).join('\r\n') + '\r\n';
}

/**
 * Trigger a .ics file download in the browser (FR-5).
 * Uses URL.createObjectURL + programmatic <a> click.
 */
export function downloadIcsFile(event: ChurchEvent): void {
  const content = generateIcsContent(event);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.id}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
