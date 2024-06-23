import { describe, expect, it } from 'vitest';
import HolyTime from '..';

describe('test HolyTime.getTime', () => {
  it('should return unix in ms', () => {
    const date = new Date('2023-01-01T00:02:00.000Z');

    const holyTime = new HolyTime(date);

    expect(holyTime.getTime()).toBe(date.getTime());
  });
});

describe('test HolyTime.getUnixTime', () => {
  it('should return unix in s', () => {
    const date = new Date('2023-01-01T00:02:00.000Z');

    const holyTime = new HolyTime(date);

    expect(holyTime.getUnixTime()).toBe(Math.floor(date.getTime() / 1000));
  });
});

describe('test HolyTime.getISOString', () => {
  it('should return ISOString', () => {
    const date = new Date('2023-01-01T00:02:00.000Z');

    const holyTime = new HolyTime(date);

    expect(holyTime.getISOString()).toBe(date.toISOString());
  });
});

describe('test HolyTime.getDate', () => {
  it('should return date', () => {
    const date = new Date('2023-01-01T00:02:00.000Z');

    const holyTime = new HolyTime(date);

    expect(holyTime.getDate()).toBe(date);
  });
});

describe('test HolyTime.isAfter', () => {
  it('should check if one date is after another', () => {
    const earlierDate = new HolyTime(new Date('2023-01-01T00:00:00.000Z'));
    const laterDate = new HolyTime(new Date('2023-01-02T00:00:00.000Z'));

    expect(earlierDate.isAfter(laterDate)).toBe(false);
    expect(laterDate.isAfter(earlierDate)).toBe(true);
  });
});

describe('test HolyTime.isBefore', () => {
  it('should check if one date is before another', () => {
    const earlierDate = new HolyTime(new Date('2023-01-01T00:00:00.000Z'));
    const laterDate = new HolyTime(new Date('2023-01-02T00:00:00.000Z'));

    expect(earlierDate.isBefore(laterDate)).toBe(true);
    expect(laterDate.isBefore(earlierDate)).toBe(false);
  });
});

describe('test HolyTime.between', () => {
  it('should calculate time difference', () => {
    const start = new HolyTime(new Date('2023-01-01T00:00:00.000Z'));
    const end = new HolyTime(new Date('2023-01-01T01:00:00.000Z'));

    expect(HolyTime.between(start, end).in('milliseconds')).toBe(HolyTime.Units.HOUR);
  });
});

describe('test HolyTime.isWeekend', () => {
  it('should check if date is weekend', () => {
    const weekday = new HolyTime(new Date('2023-01-04T01:00:00.000Z'));
    const weekend = new HolyTime(new Date('2023-01-07T00:00:00.000Z'));

    expect(weekday.isWeekend()).toBe(false);
    expect(weekend.isWeekend()).toBe(true);
  });
});

describe('test HolyTime.since', () => {
  it('should return time difference', () => {
    const date = new HolyTime(new Date('2023-01-01T01:02:03.000Z'));

    expect(HolyTime.since(date).in('seconds')).toBe((Date.now() - date.getTime()) / 1000);
  });
});

describe('test HolyTime.max', () => {
  it('should return max date', () => {
    const date = new HolyTime(new Date('2023-01-01T01:02:03.000Z'));
    const date2 = new HolyTime(new Date('2023-01-01T01:02:04.000Z'));

    expect(HolyTime.max(date, date2)).toStrictEqual(date2);
  });
});

describe('test HolyTime.min', () => {
  it('should return min date', () => {
    const date = new HolyTime(new Date('2023-01-01T01:02:03.000Z'));
    const date2 = new HolyTime(new Date('2023-01-01T01:02:04.000Z'));

    expect(HolyTime.min(date, date2)).toStrictEqual(date);
  });
});

describe('test HolyTime.getTimezone', () => {
  it('should return timezone', () => {

    expect(HolyTime.getTimeZone()).toBe('UTC');
  });
})

