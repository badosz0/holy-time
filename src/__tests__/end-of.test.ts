import { describe, expect, it } from 'vitest';
import HolyTime from '..';

describe('test HolyTime.endOf', () => {
  it('should return end of unit', () => {
    const date = new HolyTime(new Date('2023-01-01T01:02:03.000Z'));

    expect(date.endOf('hour').getISOString()).toBe('2023-01-01T01:59:59.999Z');
    expect(date.endOf('day').getISOString()).toBe('2023-01-01T23:59:59.999Z');
    expect(date.endOf('week').getISOString()).toBe('2023-01-07T23:59:59.999Z');
    expect(date.endOf('month').getISOString()).toBe('2023-01-31T23:59:59.999Z');
    expect(date.endOf('year').getISOString()).toBe('2023-12-31T23:59:59.999Z');
  });
});

describe('test endOf with timeZone', () => {
  it('should return end of unit in timeZone', () => {
    const date = new HolyTime(new Date('2023-01-01T01:02:03.000Z'));
    expect(
      date.endOf('hour', 'America/New_York').format('YYYY-MM-DD hh:mm:ss'),
    ).toBe('2023-01-01 01:59:59');
    expect(
      date
        .endOf('hour', 'America/New_York')
        .format('YYYY-MM-DD hh:mm:ss', 'Europe/Berlin'),
    ).toBe('2023-01-01 02:59:59');

    expect(
      date.endOf('day', 'Europe/London').format('YYYY-MM-DD hh:mm:ss'),
    ).toBe('2023-01-01 23:59:59');
    expect(
      date
        .endOf('day', 'America/New_York')
        .format('YYYY-MM-DD hh:mm:ss', 'Europe/London'),
    ).toBe('2023-01-01 04:59:59');
    expect(
      date
        .endOf('day', 'Europe/Berlin')
        .format('YYYY-MM-DD hh:mm:ss', 'America/New_York'),
    ).toBe('2023-01-01 19:59:59');

    expect(
      date.endOf('week', 'Europe/London').format('YYYY-MM-DD hh:mm:ss'),
    ).toBe('2023-01-07 23:59:59');
    expect(
      date
        .endOf('week', 'Europe/London')
        .format('YYYY-MM-DD hh:mm:ss', 'America/New_York'),
    ).toBe('2023-01-07 18:59:59');
    expect(
      date
        .endOf('week', 'America/New_York')
        .format('YYYY-MM-DD hh:mm:ss', 'Europe/London'),
    ).toBe('2023-01-01 04:59:59');

    expect(
      date.endOf('month', 'Europe/London').format('YYYY-MM-DD hh:mm:ss'),
    ).toBe('2023-01-31 23:59:59');
    expect(
      date
        .endOf('month', 'Europe/London')
        .format('YYYY-MM-DD hh:mm:ss', 'America/New_York'),
    ).toBe('2023-01-31 18:59:59');
    expect(
      date
        .endOf('month', 'America/New_York')
        .format('YYYY-MM-DD hh:mm:ss', 'Europe/London'),
    ).toBe('2023-01-01 04:59:59');

    expect(
      date.endOf('year', 'Europe/London').format('YYYY-MM-DD hh:mm:ss'),
    ).toBe('2023-12-31 23:59:59');
    expect(
      date
        .endOf('year', 'Europe/London')
        .format('YYYY-MM-DD hh:mm:ss', 'America/New_York'),
    ).toBe('2023-12-31 18:59:59');
    expect(
      date
        .endOf('year', 'America/New_York')
        .format('YYYY-MM-DD hh:mm:ss', 'Europe/London'),
    ).toBe('2023-01-01 04:59:59');
  });
});
