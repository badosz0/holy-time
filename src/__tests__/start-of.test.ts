import { describe, expect, it } from 'vitest';
import HolyTime from '..';

describe('test HolyTime.startOf', () => {
  it('should return start of unit', () => {
    const date = new HolyTime(new Date('2023-01-01T01:02:03.000Z'));

    expect(date.startOf('hour').getISOString()).toBe(
      '2023-01-01T01:00:00.000Z',
    );
    expect(date.startOf('day').getISOString()).toBe('2023-01-01T00:00:00.000Z');
    expect(date.startOf('week').getISOString()).toBe(
      '2023-01-01T00:00:00.000Z',
    );
    expect(date.startOf('month').getISOString()).toBe(
      '2023-01-01T00:00:00.000Z',
    );
    expect(date.startOf('year').getISOString()).toBe(
      '2023-01-01T00:00:00.000Z',
    );
  });
});

describe('test startOf with timeZone', () => {
  it('should return start of unit in timeZone', () => {
    const date = new HolyTime(new Date('2023-01-01T01:02:03.000Z'));
    expect(
      date.startOf('hour', 'America/New_York').format('YYYY-MM-DD hh:mm:ss'),
    ).toBe('2023-01-01 01:00:00');
    expect(
      date
        .startOf('hour', 'America/New_York')
        .format('YYYY-MM-DD hh:mm:ss', 'Europe/Berlin'),
    ).toBe('2023-01-01 02:00:00');

    expect(
      date.startOf('day', 'Europe/London').format('YYYY-MM-DD hh:mm:ss'),
    ).toBe('2023-01-01 00:00:00');
    expect(
      date
        .startOf('day', 'America/New_York')
        .format('YYYY-MM-DD hh:mm:ss', 'Europe/London'),
    ).toBe('2022-12-31 05:00:00');
    expect(
      date
        .startOf('day', 'Europe/Berlin')
        .format('YYYY-MM-DD hh:mm:ss', 'America/New_York'),
    ).toBe('2022-12-31 20:00:00');

    expect(
      date.startOf('week', 'Europe/London').format('YYYY-MM-DD hh:mm:ss'),
    ).toBe('2023-01-01 00:00:00');
    expect(
      date
        .startOf('week', 'Europe/London')
        .format('YYYY-MM-DD hh:mm:ss', 'America/New_York'),
    ).toBe('2022-12-31 19:00:00');
    expect(
      date
        .startOf('week', 'America/New_York')
        .format('YYYY-MM-DD hh:mm:ss', 'Europe/London'),
    ).toBe('2022-12-25 05:00:00');

    expect(
      date.startOf('month', 'Europe/London').format('YYYY-MM-DD hh:mm:ss'),
    ).toBe('2023-01-01 00:00:00');
    expect(
      date
        .startOf('month', 'Europe/London')
        .format('YYYY-MM-DD hh:mm:ss', 'America/New_York'),
    ).toBe('2022-12-31 19:00:00');
    expect(
      date
        .startOf('month', 'America/New_York')
        .format('YYYY-MM-DD hh:mm:ss', 'Europe/London'),
    ).toBe('2022-12-01 05:00:00');

    expect(
      date.startOf('year', 'Europe/London').format('YYYY-MM-DD hh:mm:ss'),
    ).toBe('2023-01-01 00:00:00');
    expect(
      date
        .startOf('year', 'Europe/London')
        .format('YYYY-MM-DD hh:mm:ss', 'America/New_York'),
    ).toBe('2022-12-31 19:00:00');
    expect(
      date
        .startOf('year', 'America/New_York')
        .format('YYYY-MM-DD hh:mm:ss', 'Europe/London'),
    ).toBe('2022-01-01 05:00:00');
  });
});
