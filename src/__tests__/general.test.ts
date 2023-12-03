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
});
