import { describe, expect, it } from 'vitest';
import HolyTime from '..';

describe('general', () => {
  it('should return unix in ms', () => {
    const date = new Date('2023-01-01T00:02:00.000Z');

    const holyTime = new HolyTime(date);

    expect(holyTime.getTime()).toBe(date.getTime());
  });

  it('should return unix in s', () => {
    const date = new Date('2023-01-01T00:02:00.000Z');

    const holyTime = new HolyTime(date);

    expect(holyTime.getUnixTime()).toBe(Math.floor(date.getTime() / 1000));
  });

  it('should return ISOString', () => {
    const date = new Date('2023-01-01T00:02:00.000Z');

    const holyTime = new HolyTime(date);

    expect(holyTime.getISOString()).toBe(date.toISOString());
  });

  it('should return date', () => {
    const date = new Date('2023-01-01T00:02:00.000Z');

    const holyTime = new HolyTime(date);

    expect(holyTime.getDate()).toBe(date);
  });

  it('should subtract time correctly', () => {
    const date = new Date('2023-01-01T01:00:00.000Z');
    const holyTime = new HolyTime(date);
    const expected = new Date('2023-01-01T00:00:00.000Z');

    expect(holyTime.subtract(1, 'hours').getDate()).toEqual(expected);
  });

  it('should check if one date is after another correctly', () => {
    const earlierDate = new HolyTime(new Date('2023-01-01T00:00:00.000Z'));
    const laterDate = new HolyTime(new Date('2023-01-02T00:00:00.000Z'));

    expect(earlierDate.isAfter(laterDate)).toBe(false);
    expect(laterDate.isAfter(earlierDate)).toBe(true);
  });

  it('should check if one date is before another correctly', () => {
    const earlierDate = new HolyTime(new Date('2023-01-01T00:00:00.000Z'));
    const laterDate = new HolyTime(new Date('2023-01-02T00:00:00.000Z'));

    expect(earlierDate.isBefore(laterDate)).toBe(true);
    expect(laterDate.isBefore(earlierDate)).toBe(false);
  });

  it('should calculate time difference', () => {
    const start = new HolyTime(new Date('2023-01-01T00:00:00.000Z'));
    const end = new HolyTime(new Date('2023-01-01T01:00:00.000Z'));

    expect(HolyTime.between(start, end)).toBe(3_600_000); // 1 hour in milliseconds
  });

  it('should check if date is weekend', () => {
    const weekday = new HolyTime(new Date('2023-01-04T01:00:00.000Z'));
    const weekend = new HolyTime(new Date('2023-01-07T00:00:00.000Z'));

    expect(weekday.isWeekend()).toBe(false);
    expect(weekend.isWeekend()).toBe(true);
  });
});
