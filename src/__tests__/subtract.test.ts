import { describe, expect, it } from 'vitest';
import HolyTime from '..';

describe('test HolyTime.subtract', () => {
  it('should handle subtracting zero', () => {
    const date = new HolyTime(new Date('2023-01-01T00:00:00.000Z'));
    expect(date.subtract(0, 'milliseconds').getTime()).toBe(date.getTime());
  });

  it('should handle negative subtracting', () => {
    const date = new HolyTime(new Date('2023-01-01T00:00:00.000Z'));
    const expected = new Date('2023-01-01T01:00:00.000Z');
    expect(date.subtract(-60, 'minutes').getDate()).toEqual(expected);
  });

  it('should handle subtracting across day boundary', () => {
    const date = new HolyTime(new Date('2023-01-02T01:00:00.000Z'));
    const expected = new Date('2023-01-01T23:00:00.000Z');
    expect(date.subtract(2, 'hours').getDate()).toEqual(expected);
  });

  it('should handle subtracting across month boundary', () => {
    const date = new HolyTime(new Date('2023-02-01T01:00:00.000Z'));
    const expected = new Date('2023-01-31T23:00:00.000Z');
    expect(date.subtract(2, 'hours').getDate()).toEqual(expected);
  });

  it('should handle subtracting across year boundary', () => {
    const date = new HolyTime(new Date('2024-01-01T01:00:00.000Z'));
    const expected = new Date('2023-12-31T23:00:00.000Z');
    expect(date.subtract(2, 'hours').getDate()).toEqual(expected);
  });

  it('should handle subtracting across leap year (2024) boundary', () => {
    const date = new HolyTime(new Date('2024-01-01T01:00:00.000Z'));
    const expected = new Date('2023-12-31T23:00:00.000Z');
    expect(date.subtract(2, 'hours').getDate()).toEqual(expected);
  });

  it('should handle subtracting in leap year (2024)', () => {
    const date = new HolyTime(new Date('2024-02-29T00:00:00.000Z'));
    const expected = new Date('2024-02-28T00:00:00.000Z');
    expect(date.subtract(1, 'days').getDate()).toEqual(expected);
  });

  it('should handle large subtracting values', () => {
    const date = new HolyTime(new Date('2023-01-01T00:00:00.000Z'));
    const yearInMs = 1000 * 60 * 60 * 24 * 365;
    const expected = new Date('2013-01-03T00:00:00.000Z'); // 2 leap years == -2 days
    expect(date.subtract(10 * yearInMs, 'milliseconds').getDate()).toEqual(expected);
  });

  it('should handle subtracting with non-standard units', () => {
    const date = new HolyTime(new Date('2023-01-01T00:00:00.000Z'));
    // @ts-expect-error
    expect(() => date.subtract(1, 'nonStandardUnit')).toThrow('Invalid unit: nonStandardUnit');
  });
});
