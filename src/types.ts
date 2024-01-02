import { TimeUnits } from './constants';
import { HolyTime } from './time';

export type TimeResolvable = HolyTime | Date | number | string;
export type HumanUnit = `${Lowercase<keyof typeof TimeUnits>}s`;
export type IntervalUnit = 'hour' | 'day' | 'week' | 'month' | 'year';
