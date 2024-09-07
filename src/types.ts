import type { TimeUnits } from './constants';
import type { HolyTime } from './time';

export type TimeResolvable = HolyTime | Date | number | string;
export type HumanUnit = `${Lowercase<keyof typeof TimeUnits>}s`;
export type GetUnit = `${Lowercase<keyof typeof TimeUnits>}`;
export type IntervalUnit = 'hour' | 'day' | 'week' | 'month' | 'year';
