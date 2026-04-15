/**
 * E-1: Event Data Model Tests
 *
 * Tests for config/events.ts -- the foundation tablet.
 */

import {
  EVENTS,
  CHURCH_LOCATION,
  CHURCH_TIMEZONE,
  ChurchEvent,
  CalendarPlatform,
} from '../config/events';

describe('E-1: Event Data Model', () => {
  // E-1.3: EVENTS array has two entries
  test('EVENTS array has exactly two entries', () => {
    expect(EVENTS).toHaveLength(2);
  });

  // E-1.4: Sunday Service data correctness
  describe('Sunday Service event', () => {
    const sundayService = EVENTS.find((e) => e.id === 'sunday-service');

    test('exists in EVENTS array', () => {
      expect(sundayService).toBeDefined();
    });

    test('has correct title', () => {
      expect(sundayService!.title).toBe('Sunday Service');
    });

    test('has correct subtitle', () => {
      expect(sundayService!.subtitle).toBe('Every Sunday');
    });

    test('has correct time', () => {
      expect(sundayService!.time).toBe('10:30 AM');
    });

    test('has correct duration', () => {
      expect(sundayService!.duration).toBe(90);
    });

    test('has correct recurrence rule', () => {
      expect(sundayService!.recurrenceRule).toBe('FREQ=WEEKLY;BYDAY=SU');
    });

    test('has correct timezone', () => {
      expect(sundayService!.timezone).toBe('America/Chicago');
    });

    test('has all three calendar platforms', () => {
      expect(sundayService!.calendarPlatforms).toEqual(['google', 'apple', 'outlook']);
    });
  });

  // E-1.5: Woman of the Well data correctness
  describe('Woman of the Well event', () => {
    const wotw = EVENTS.find((e) => e.id === 'woman-of-the-well');

    test('exists in EVENTS array', () => {
      expect(wotw).toBeDefined();
    });

    test('has correct title', () => {
      expect(wotw!.title).toBe('Woman of the Well');
    });

    test('has correct subtitle', () => {
      expect(wotw!.subtitle).toBe('Every 2nd Sunday');
    });

    test('has correct time', () => {
      expect(wotw!.time).toBe('2:00 PM');
    });

    test('has correct duration', () => {
      expect(wotw!.duration).toBe(90);
    });

    test('has correct recurrence rule', () => {
      expect(wotw!.recurrenceRule).toBe('FREQ=MONTHLY;BYDAY=2SU');
    });

    test('has correct timezone', () => {
      expect(wotw!.timezone).toBe('America/Chicago');
    });
  });

  // E-1.6: No RRULE prefix in recurrenceRule
  test('no RRULE: prefix in recurrenceRule for any event', () => {
    EVENTS.forEach((event) => {
      expect(event.recurrenceRule.startsWith('RRULE:')).toBe(false);
    });
  });

  // E-1.7: Location uses CHURCH_LOCATION constant
  test('both events use the same church location', () => {
    const expectedLocation = 'Open Door Full Gospel Church, 135 S 1st St, Pleasant Hill, MO 64080';
    EVENTS.forEach((event) => {
      expect(event.location).toBe(expectedLocation);
    });
    expect(CHURCH_LOCATION).toBe(expectedLocation);
  });

  // E-1.8: Timezone is America/Chicago
  test('both events use America/Chicago timezone', () => {
    EVENTS.forEach((event) => {
      expect(event.timezone).toBe('America/Chicago');
    });
    expect(CHURCH_TIMEZONE).toBe('America/Chicago');
  });

  // E-1.9: No Philippines reference -- checked via string content
  test('no Philippines reference in event data', () => {
    const allText = JSON.stringify(EVENTS).toLowerCase();
    expect(allText).not.toContain('philippines');
  });
});
