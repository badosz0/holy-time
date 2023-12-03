import { describe, expect, it } from 'vitest';
import HolyTime from '..';

describe('format', () => {
  it('should format date', () => {
    const date = new HolyTime(new Date('2023-01-01T13:45:30.000Z'));
    const format = 'YYYY-MM-DD hh:mm:ss';

    expect(date.format(format)).toBe('2023-01-01 13:45:30');
  });

  it('should format year', () => {
    const date = new HolyTime(new Date('2023-01-01T00:00:00.000Z'));
    expect(date.format('YYYY')).toBe('2023');
    expect(date.format('YY')).toBe('23');
  });

  it('should format month', () => {
    const date = new HolyTime(new Date('2023-04-01T00:00:00.000Z'));
    expect(date.format('MMMM')).toBe('April');
    expect(date.format('MMM')).toBe('Apr');
    expect(date.format('MM')).toBe('04');
    expect(date.format('M')).toBe('4');
  });

  it('should format day', () => {
    const date = new HolyTime(new Date('2023-01-09T00:00:00.000Z'));
    expect(date.format('DD')).toBe('09');
    expect(date.format('D')).toBe('9');
  });

  it('should format hour', () => {
    const date = new HolyTime(new Date('2023-01-01T13:00:00.000Z'));
    expect(date.format('hh')).toBe('13');
    expect(date.format('h')).toBe('13');
  });

  it('should format minute', () => {
    const date = new HolyTime(new Date('2023-01-01T00:05:00.000Z'));
    expect(date.format('mm')).toBe('05');
    expect(date.format('m')).toBe('5');
  });

  it('should format second', () => {
    const date = new HolyTime(new Date('2023-01-01T00:00:09.000Z'));
    expect(date.format('ss')).toBe('09');
    expect(date.format('s')).toBe('9');
  });

  it('should ignore unknown format & include it', () => {
    const date = new HolyTime(new Date('2023-01-01T00:00:00.000Z'));
    expect(date.format('YYYY MM DD hh mm ss QQQ')).toBe('2023 01 01 00 00 00 QQQ');
  });

  it('should format date with mixed valid and invalid tokens', () => {
    const date = new HolyTime(new Date('2023-01-01T15:45:30.000Z'));
    expect(date.format('Year: YYYY, Hour: hh, Unknown: UUU')).toBe('Year: 2023, Hour: 15, Unknown: UUU');
  });

  it('should handle empty format string correctly', () => {
    const date = new HolyTime(new Date('2023-01-01T00:00:00.000Z'));
    expect(date.format('')).toBe('');
  });
});