import { describe, expect, it } from 'vitest';
import HolyTime from '..';

describe('test HolyTime.isLeapYear', () => {
  it('should return true for leap years', () => {
    expect(HolyTime.isLeapYear(2020)).toBe(true);
    expect(HolyTime.isLeapYear(2000)).toBe(true); // Century leap year
    expect(HolyTime.isLeapYear(1988)).toBe(true);
  });

  it('should return false for non-leap years', () => {
    expect(HolyTime.isLeapYear(2021)).toBe(false);
    expect(HolyTime.isLeapYear(1900)).toBe(false); // Century non-leap year
    expect(HolyTime.isLeapYear(1989)).toBe(false);
  });

  it('should handle edge cases around known leap years', () => {
    expect(HolyTime.isLeapYear(1999)).toBe(false); // Year before a century leap year
    expect(HolyTime.isLeapYear(2001)).toBe(false); // Year after a leap year
    expect(HolyTime.isLeapYear(2100)).toBe(false); // Upcoming century non-leap year
  });

  it('should handle extreme year values', () => {
    expect(HolyTime.isLeapYear(1600)).toBe(true); // Distant past century leap year
    expect(HolyTime.isLeapYear(2400)).toBe(true); // Future century leap year
    expect(HolyTime.isLeapYear(4000)).toBe(true); // Far future leap year
  });

  it('should throw or handle error for invalid year inputs', () => {
    expect(() => HolyTime.isLeapYear(null)).toThrow();
    // @ts-expect-error
    expect(() => HolyTime.isLeapYear()).toThrow();
    // @ts-expect-error
    expect(() => HolyTime.isLeapYear('not a year')).toThrow();
    expect(() => HolyTime.isLeapYear(-1)).toThrow();
  });
});
