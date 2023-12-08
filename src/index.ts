import { ValueOf } from 'type-fest';
import { FORMAT_REGEX, MONTH_NAMES, RELATIVE_MAP, TIMEZONES, TIMEZONE_MAP, TimeUnits, TimeZone } from './constants';

type TimeResolvable = HolyTime | Date | number | string;
type HumanUnit = `${Lowercase<keyof typeof TimeUnits>}s`;

type IntervalUnit = 'hour' | 'day' | 'week' | 'month' | 'year';

export default class HolyTime {
  public static Units = TimeUnits;
  public static TimeZones = TIMEZONES;
  private date: Date;

  constructor(initialDate: TimeResolvable = new Date()) {
    this.date = HolyTime.resolveDate(initialDate);
  }

  private static resolveDate(time: TimeResolvable): Date {
    // TODO: validate
    return time instanceof Date
      ? time
      : time instanceof HolyTime
        ? time.getDate()
        : new Date(time);
  }

  private static adjustToTimeZone(date: Date, timeZone?: TimeZone): Date {
    if (!timeZone) {
      return date;
    }

    timeZone = TIMEZONE_MAP[timeZone] ?? timeZone;

    return new Date(date.toLocaleString('en-US', { timeZone }));
  }

  private static getUnit(unit: HumanUnit): ValueOf<typeof TimeUnits> {
    const unitKey = unit.toUpperCase().slice(0, -1) as keyof typeof HolyTime.Units;

    if (!HolyTime.Units.hasOwnProperty(unitKey)) {
      throw new Error(`Invalid unit: ${unit}`);
    }

    return HolyTime.Units[unitKey];
  }

  public static now(): HolyTime {
    return new HolyTime();
  }

  public static add(time: TimeResolvable, amount: number, unit: HumanUnit = 'milliseconds'): HolyTime {
    return new HolyTime(HolyTime.resolveDate(time).getTime() + (amount * HolyTime.getUnit(unit)));
  }

  public add(amount: number, unit: HumanUnit = 'milliseconds'): this {
    this.date = new Date(this.date.getTime() + (amount * HolyTime.getUnit(unit)));
    return this;
  }

  public static subtract(time: TimeResolvable, amount: number, unit: HumanUnit = 'milliseconds'): HolyTime {
    return HolyTime.add(time, -amount, unit);
  }

  public subtract(amount: number, unit: HumanUnit = 'milliseconds'): this {
    return this.add(-amount, unit);
  }

  public static in(amount: number, unit: HumanUnit = 'milliseconds'): HolyTime {
    return new HolyTime(Date.now() + (amount * HolyTime.getUnit(unit ?? 'milliseconds')));
  }

  public static isEqual(timeA: TimeResolvable, timeB: TimeResolvable): boolean {
    return HolyTime.resolveDate(timeA).getTime() === HolyTime.resolveDate(timeB).getTime();
  }

  public isEqual(time: TimeResolvable): boolean {
    return this.date.getTime() === HolyTime.resolveDate(time).getTime();
  }

  public static isWeekend(time: TimeResolvable): boolean {
    const date = HolyTime.resolveDate(time);

    const weekDay = date.getDay();

    return weekDay === 6 || weekDay === 0;
  }

  public isWeekend(): boolean {
    return HolyTime.isWeekend(this);
  }

  /**
    * Determines if a given year is a leap year.
    *
    * A leap year is a year that is divisible by 4, except for end-of-century years,
    * which must be divisible by 400. This means that the year 2000 was a leap year,
    * although 1900 was not.
    */
  public static isLeapYear(year: number): boolean {
    if (typeof year !== 'number' || Number.isNaN(year) || !Number.isFinite(year)) {
      throw new TypeError('Invalid input: Year must be a finite number');
    }

    if (year < 0 || !Number.isInteger(year)) {
      throw new Error('Invalid input: Year must be a positive integer');
    }

    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  public isLeapYear(time: TimeResolvable): boolean {
    return HolyTime.isLeapYear(HolyTime.resolveDate(time).getFullYear());
  }

  public static between(timeA: TimeResolvable, timeB: TimeResolvable): number {
    return Math.abs(HolyTime.resolveDate(timeA).getTime() - HolyTime.resolveDate(timeB).getTime());
  }

  public static isAfter(timeA: TimeResolvable, timeB: TimeResolvable): boolean {
    return HolyTime.resolveDate(timeA).getTime() > HolyTime.resolveDate(timeB).getTime();
  }

  public isAfter(time: TimeResolvable): boolean {
    return this.date.getTime() > HolyTime.resolveDate(time).getTime();
  }

  public static isBefore(timeA: TimeResolvable, timeB: TimeResolvable): boolean {
    return HolyTime.resolveDate(timeA).getTime() < HolyTime.resolveDate(timeB).getTime();
  }

  public isBefore(time: TimeResolvable): boolean {
    return this.date.getTime() < HolyTime.resolveDate(time).getTime();
  }

  public static since(time: TimeResolvable): number {
    return Date.now() - HolyTime.resolveDate(time).getTime();
  }

  public static max(...times: TimeResolvable[]): HolyTime {
    return new HolyTime(Math.max(...times.map(time => HolyTime.resolveDate(time).getTime())));
  }

  public static min(...times: TimeResolvable[]): HolyTime {
    return new HolyTime(Math.min(...times.map(time => HolyTime.resolveDate(time).getTime())));
  }

  public static startOf(unit: IntervalUnit, time: TimeResolvable = new Date(), timeZone?: TimeZone): HolyTime {
    const date = HolyTime.adjustToTimeZone(HolyTime.resolveDate(time), timeZone);
    const offset = HolyTime.between(date, time);

    switch (unit) {
      case 'hour':
        return new HolyTime(new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours())).add(offset);

      case 'day':
        return new HolyTime(new Date(date.getFullYear(), date.getMonth(), date.getDate())).add(offset);

      case 'week':
        return new HolyTime(new Date(date.getFullYear(), date.getMonth(), date.getDate())).subtract(date.getDay(), 'days').add(offset);

      case 'month':
        return new HolyTime(new Date(date.getFullYear(), date.getMonth())).add(offset);

      case 'year':
        return new HolyTime(new Date(date.getFullYear(), 0)).add(offset);
    }
  }

  public startOf(unit: IntervalUnit, timeZone?: TimeZone): HolyTime {
    return HolyTime.startOf(unit, this, timeZone);
  }

  public static endOf(unit: IntervalUnit, time: TimeResolvable = new Date(), timeZone?: TimeZone): HolyTime {
    const date = HolyTime.adjustToTimeZone(HolyTime.resolveDate(time), timeZone);
    const offset = HolyTime.between(date, time);

    switch (unit) {
      case 'hour':
        return HolyTime.startOf('hour', date).add(HolyTime.Units.HOUR).subtract(HolyTime.Units.MILLISECOND).add(offset);

      case 'day':
        return HolyTime.startOf('day', date).add(HolyTime.Units.DAY).subtract(HolyTime.Units.MILLISECOND).add(offset);

      case 'week':
        return HolyTime.startOf('week', date).add(HolyTime.Units.WEEK).subtract(HolyTime.Units.MILLISECOND).add(offset);

      case 'month': {
        if (date.getMonth() === 11) {
          return new HolyTime(new Date(date.getFullYear() + 1, 0)).subtract(HolyTime.Units.MILLISECOND).add(offset);
        }

        return new HolyTime(new Date(date.getFullYear(), date.getMonth() + 1)).subtract(HolyTime.Units.MILLISECOND).add(offset);
      }

      case 'year':
        return new HolyTime(new Date(date.getFullYear() + 1, 0)).subtract(HolyTime.Units.MILLISECOND).add(offset);
    }
  }

  public endOf(unit: IntervalUnit, timeZone?: TimeZone): HolyTime {
    return HolyTime.endOf(unit, this, timeZone);
  }

  public static format(time: TimeResolvable, format: string, timeZone?: TimeZone): string {
    const date = HolyTime.adjustToTimeZone(HolyTime.resolveDate(time), timeZone);

    const values: Record<string, string> = {
      YY: date.getFullYear().toString().slice(2, 4),
      YYYY: date.getFullYear().toString(),
      M: (date.getMonth() + 1).toString(),
      MM: (date.getMonth() + 1).toString().padStart(2, '0'),
      MMM: MONTH_NAMES[date.getMonth()].slice(0, 3),
      MMMM: MONTH_NAMES[date.getMonth()],
      D: date.getDate().toString(),
      DD: date.getDate().toString().padStart(2, '0'),
      h: date.getHours().toString(),
      hh: date.getHours().toString().padStart(2, '0'),
      m: date.getMinutes().toString(),
      mm: date.getMinutes().toString().padStart(2, '0'),
      s: date.getSeconds().toString(),
      ss: date.getSeconds().toString().padStart(2, '0'),
    };

    return format.replace(FORMAT_REGEX, (match, group) => group ?? values[match] ?? '?');
  }

  public format(format: string, timeZone?: TimeZone): string {
    return HolyTime.format(this, format, timeZone);
  }

  public static relativeFromTo(timeA: TimeResolvable, timeB: TimeResolvable): string {
    const differance = HolyTime.between(timeA, timeB);
    const time = Math.max(
      ...Object
        .keys(RELATIVE_MAP)
        .map(Number)
        .filter(n => n <= differance),
    );

    const format = RELATIVE_MAP[time];
    const future = HolyTime.isBefore(timeA, timeB);
    const output = typeof format === 'string'
      ? format
      : format(differance);

    return future
      ? `in ${output}`
      : `${output} ago`;
  }

  public static next(unit: IntervalUnit, time: TimeResolvable = new Date(), timeZone?: TimeZone): HolyTime {
    return HolyTime.endOf(unit, time, timeZone).add(HolyTime.Units.MILLISECOND);
  }

  public next(unit: IntervalUnit, timeZone?: TimeZone): HolyTime {
    return HolyTime.next(unit, this, timeZone);
  }

  public getDate(): Date {
    return this.date;
  }

  public getTime(): number {
    return this.date.getTime();
  }

  public getUnixTime(): number {
    return Math.floor(this.date.getTime() / 1000);
  }

  public getISOString(): string {
    return this.date.toISOString();
  }

  public clone(): HolyTime {
    return new HolyTime(this.date);
  }

  public getRelativeTo(time: TimeResolvable): string {
    return HolyTime.relativeFromTo(this, time);
  }

  public getRelativeFrom(time: TimeResolvable): string {
    return HolyTime.relativeFromTo(time, this);
  }
}

export { TimeZone } from './constants';
