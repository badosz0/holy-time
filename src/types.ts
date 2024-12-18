import type { TimeUnits } from './constants';
import type { HolyDuration } from './duration';
import type { HolyTime } from './time';

export type TimeResolvable = HolyTime | Date | number | string;
export type DurationResolvable = HolyDuration | number;
export type HumanUnit = `${Lowercase<keyof typeof TimeUnits>}s`;
export type GetUnit = `${Lowercase<keyof typeof TimeUnits>}`;
export type IntervalUnit =
  | 'millisecond'
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'year';
