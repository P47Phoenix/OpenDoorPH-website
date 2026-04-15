/**
 * E-3 + E-4: Calendar Link Utilities Tests
 *
 * Tests for utils/calendarLinks.ts -- the .ics scroll and Google Calendar URL.
 */

import { generateGoogleCalendarUrl, generateIcsContent, downloadIcsFile } from '../utils/calendarLinks';
import { ChurchEvent } from '../config/events';

const sundayService: ChurchEvent = {
  id: 'sunday-service',
  title: 'Sunday Service',
  subtitle: 'Every Sunday',
  dayOfWeek: 0,
  time: '10:30 AM',
  duration: 90,
  recurrenceRule: 'FREQ=WEEKLY;BYDAY=SU',
  location: 'Open Door Full Gospel Church, 135 S 1st St, Pleasant Hill, MO 64080',
  description: 'Sunday Service at Open Door Full Gospel Church. All are welcome.',
  calendarPlatforms: ['google', 'apple', 'outlook'],
  timezone: 'America/Chicago',
  startDate: '2026-04-12T10:30:00',
};

const wotwEvent: ChurchEvent = {
  id: 'woman-of-the-well',
  title: 'Woman of the Well',
  subtitle: 'Every 2nd Sunday',
  dayOfWeek: 0,
  time: '2:00 PM',
  duration: 90,
  recurrenceRule: 'FREQ=MONTHLY;BYDAY=2SU',
  location: 'Open Door Full Gospel Church, 135 S 1st St, Pleasant Hill, MO 64080',
  description: 'Woman of the Well ministry at Open Door Full Gospel Church. All are welcome.',
  calendarPlatforms: ['google', 'apple', 'outlook'],
  timezone: 'America/Chicago',
  startDate: '2026-04-12T14:00:00',
};

describe('E-3: Google Calendar URL generation', () => {
  // E-3.12: Google Calendar URL format
  test('generates valid Google Calendar URL for Sunday Service', () => {
    const url = generateGoogleCalendarUrl(sundayService);
    expect(url).toContain('https://calendar.google.com/calendar/render');
    expect(url).toContain('action=TEMPLATE');
    expect(url).toContain('ctz=America%2FChicago');
    expect(url).toContain(encodeURIComponent('Sunday Service - Open Door Full Gospel Church'));
    expect(url).toContain(encodeURIComponent('Open Door Full Gospel Church, 135 S 1st St, Pleasant Hill, MO 64080'));
  });

  // E-3.13: Google Calendar URL includes RRULE for WotW
  test('includes correct RRULE for Woman of the Well', () => {
    const url = generateGoogleCalendarUrl(wotwEvent);
    expect(url).toContain(encodeURIComponent('RRULE:FREQ=MONTHLY;BYDAY=2SU'));
  });

  test('includes correct RRULE for Sunday Service', () => {
    const url = generateGoogleCalendarUrl(sundayService);
    expect(url).toContain(encodeURIComponent('RRULE:FREQ=WEEKLY;BYDAY=SU'));
  });

  test('dates parameter uses local time format with start/end', () => {
    const url = generateGoogleCalendarUrl(sundayService);
    // Sunday Service: 10:30 AM, 90 min -> 12:00 PM
    expect(url).toContain('dates=20260412T103000%2F20260412T120000');
  });

  test('dates parameter for Woman of the Well', () => {
    const url = generateGoogleCalendarUrl(wotwEvent);
    // WotW: 2:00 PM, 90 min -> 3:30 PM
    expect(url).toContain('dates=20260412T140000%2F20260412T153000');
  });
});

describe('E-4: ICS File Generation', () => {
  // E-4.1: Valid structure
  test('generates valid .ics structure', () => {
    const ics = generateIcsContent(sundayService);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('END:VCALENDAR');
    expect(ics).toContain('BEGIN:VTIMEZONE');
    expect(ics).toContain('END:VTIMEZONE');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('END:VEVENT');
  });

  // E-4.2: VCALENDAR header fields
  test('includes VCALENDAR header fields', () => {
    const ics = generateIcsContent(sundayService);
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('PRODID:-//Open Door Full Gospel Church//Events//EN');
    expect(ics).toContain('CALSCALE:GREGORIAN');
    expect(ics).toContain('METHOD:PUBLISH');
  });

  // E-4.3: VTIMEZONE STANDARD block
  test('includes STANDARD block for America/Chicago', () => {
    const ics = generateIcsContent(sundayService);
    expect(ics).toContain('DTSTART:19701101T020000');
    expect(ics).toContain('RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU');
    expect(ics).toContain('TZOFFSETFROM:-0500');
    expect(ics).toContain('TZOFFSETTO:-0600');
    expect(ics).toContain('TZNAME:CST');
  });

  // E-4.4: VTIMEZONE DAYLIGHT block
  test('includes DAYLIGHT block for America/Chicago', () => {
    const ics = generateIcsContent(sundayService);
    expect(ics).toContain('DTSTART:19700308T020000');
    expect(ics).toContain('RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU');
    expect(ics).toContain('TZOFFSETFROM:-0600');
    expect(ics).toContain('TZOFFSETTO:-0500');
    expect(ics).toContain('TZNAME:CDT');
  });

  // E-4.5: DTSTART uses TZID, not UTC
  test('DTSTART uses TZID=America/Chicago, not UTC', () => {
    const ics = generateIcsContent(sundayService);
    expect(ics).toMatch(/DTSTART;TZID=America\/Chicago:\d{8}T\d{6}/);
    // Should NOT contain naive UTC DTSTART in the VEVENT
    const veventBlock = ics.split('BEGIN:VEVENT')[1].split('END:VEVENT')[0];
    expect(veventBlock).not.toMatch(/DTSTART:\d{8}T\d{6}Z/);
  });

  // E-4.6: DTEND uses TZID, not UTC
  test('DTEND uses TZID=America/Chicago, not UTC', () => {
    const ics = generateIcsContent(sundayService);
    expect(ics).toMatch(/DTEND;TZID=America\/Chicago:\d{8}T\d{6}/);
    const veventBlock = ics.split('BEGIN:VEVENT')[1].split('END:VEVENT')[0];
    expect(veventBlock).not.toMatch(/DTEND:\d{8}T\d{6}Z/);
  });

  // E-4.7: DTEND = DTSTART + duration (Sunday Service: 10:30 + 90min = 12:00)
  test('DTEND equals DTSTART plus duration for Sunday Service', () => {
    const ics = generateIcsContent(sundayService);
    expect(ics).toContain('DTSTART;TZID=America/Chicago:20260412T103000');
    expect(ics).toContain('DTEND;TZID=America/Chicago:20260412T120000');
  });

  // E-4.8: DTEND for Woman of the Well (14:00 + 90min = 15:30)
  test('DTEND equals DTSTART plus duration for Woman of the Well', () => {
    const ics = generateIcsContent(wotwEvent);
    expect(ics).toContain('DTSTART;TZID=America/Chicago:20260412T140000');
    expect(ics).toContain('DTEND;TZID=America/Chicago:20260412T153000');
  });

  // E-4.9: Sunday Service RRULE
  test('includes correct RRULE for Sunday Service', () => {
    const ics = generateIcsContent(sundayService);
    expect(ics).toContain('RRULE:FREQ=WEEKLY;BYDAY=SU');
  });

  // E-4.10: Woman of the Well RRULE
  test('includes correct RRULE for Woman of the Well', () => {
    const ics = generateIcsContent(wotwEvent);
    expect(ics).toContain('RRULE:FREQ=MONTHLY;BYDAY=2SU');
  });

  // E-4.11: SUMMARY format
  test('SUMMARY follows the correct format', () => {
    const ics = generateIcsContent(sundayService);
    expect(ics).toContain('SUMMARY:Sunday Service - Open Door Full Gospel Church');
  });

  // E-4.12: LOCATION includes church address
  test('LOCATION includes church address', () => {
    const ics = generateIcsContent(sundayService);
    expect(ics).toContain('LOCATION:Open Door Full Gospel Church, 135 S 1st St, Pleasant Hill, MO 64080');
  });

  // E-4.13: UID format
  test('UID follows the correct format', () => {
    const ics = generateIcsContent(sundayService);
    expect(ics).toContain('UID:sunday-service@opendoorphchurch.com');
  });

  test('UID for Woman of the Well', () => {
    const ics = generateIcsContent(wotwEvent);
    expect(ics).toContain('UID:woman-of-the-well@opendoorphchurch.com');
  });

  // E-4.14: CRLF line endings
  test('uses CRLF line endings', () => {
    const ics = generateIcsContent(sundayService);
    // Every line should end with \r\n
    const lines = ics.split('\r\n');
    // The last element after split will be empty (trailing CRLF)
    expect(lines[lines.length - 1]).toBe('');
    // No bare \n without preceding \r
    const bareNewlines = ics.replace(/\r\n/g, '').match(/\n/g);
    expect(bareNewlines).toBeNull();
  });

  // E-4.15: No naive UTC in VEVENT
  test('no naive UTC timestamps in VEVENT block', () => {
    const ics = generateIcsContent(sundayService);
    const veventBlock = ics.split('BEGIN:VEVENT')[1].split('END:VEVENT')[0];
    expect(veventBlock).not.toMatch(/DTSTART:\d{8}T\d{6}Z/);
    expect(veventBlock).not.toMatch(/DTEND:\d{8}T\d{6}Z/);
  });

  // E-4.16: downloadIcsFile triggers Blob download
  test('downloadIcsFile triggers blob download', () => {
    const mockCreateObjectURL = jest.fn(() => 'blob:mock-url');
    const mockRevokeObjectURL = jest.fn();
    const mockClick = jest.fn();
    const mockAppendChild = jest.fn();
    const mockRemoveChild = jest.fn();

    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    const originalCreateElement = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') {
        const link = originalCreateElement('a');
        link.click = mockClick;
        return link;
      }
      return originalCreateElement(tag);
    });

    jest.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild);
    jest.spyOn(document.body, 'removeChild').mockImplementation(mockRemoveChild);

    downloadIcsFile(sundayService);

    expect(mockCreateObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    const blob = mockCreateObjectURL.mock.calls[0][0] as Blob;
    expect(blob.type).toBe('text/calendar;charset=utf-8');
    expect(mockClick).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');

    jest.restoreAllMocks();
  });

  // E-3.15: .ics filename format
  test('download filename is event-id.ics', () => {
    const mockCreateObjectURL = jest.fn(() => 'blob:mock-url');
    const mockRevokeObjectURL = jest.fn();

    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    let capturedLink: HTMLAnchorElement | null = null;
    const originalCreateElement = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') {
        capturedLink = originalCreateElement('a') as HTMLAnchorElement;
        capturedLink.click = jest.fn();
        return capturedLink;
      }
      return originalCreateElement(tag);
    });

    jest.spyOn(document.body, 'appendChild').mockImplementation(jest.fn());
    jest.spyOn(document.body, 'removeChild').mockImplementation(jest.fn());

    downloadIcsFile(sundayService);
    expect(capturedLink!.download).toBe('sunday-service.ics');

    downloadIcsFile(wotwEvent);
    expect(capturedLink!.download).toBe('woman-of-the-well.ics');

    jest.restoreAllMocks();
  });
});
