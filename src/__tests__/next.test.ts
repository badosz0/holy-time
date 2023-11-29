import { describe, expect, it } from 'vitest';
import HolyTime from '..';

describe('next()', () => {
  it('should return the next hour', () => {
    const startDate = new Date('2023-01-01T00:02:00.000Z');
    const expectedDate = new Date('2023-01-01T01:00:00.000Z');

    const holyTime = new HolyTime(startDate);

    expect(holyTime.next('hour').getTime()).toBe(expectedDate.getTime());
  });

  it('should return the next hour and skip a day', () => {
    const startDate = new Date('2023-01-01T23:23:00.000Z');
    const expectedDate = new Date('2023-01-02T00:00:00.000Z');

    const holyTime = new HolyTime(startDate);

    expect(holyTime.next('hour').getTime()).toBe(expectedDate.getTime());
  });

  it('should return the next day', () => {
    const startDate = new Date('2023-01-01T00:00:00.000Z');
    const expectedDate = new Date('2023-01-02T00:00:00.000Z');

    const holyTime = new HolyTime(startDate);

    expect(holyTime.next('day').getTime()).toBe(expectedDate.getTime());
  });

  it('should return the next week', () => {
    const startDate = new Date('2023-01-02T00:00:00.000Z');
    const expectedDate = new Date('2023-01-08T00:00:00.000Z');

    const holyTime = new HolyTime(startDate);

    expect(holyTime.next('week').getTime()).toBe(expectedDate.getTime());
  });

  it('should return the next week on a sunday', () => {
    const startDate = new Date('2023-01-01T00:00:00.000Z');
    const expectedDate = new Date('2023-01-02T00:00:00.000Z');

    const holyTime = new HolyTime(startDate);

    expect(holyTime.next('week').getTime()).toBe(expectedDate.getTime());
  });

  it('should return the next year', () => {
    const startDate = new Date('2023-01-01T00:00:00.000Z');
    const expectedDate = new Date('2024-01-01T00:00:00.000Z');

    const holyTime = new HolyTime(startDate);

    expect(holyTime.next('year').getTime()).toBe(expectedDate.getTime());
  });
});
