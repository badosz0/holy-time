import type { ValueOf } from 'type-fest';
import {
  DAY_NAMES,
  FORMAT_REGEX,
  MONTH_NAMES,
  RELATIVE_MAP,
  TIMEZONES,
  TIMEZONE_MAP,
  TimeUnits,
  type TimeZone,
} from './constants';
import type { GetUnit, HumanUnit, IntervalUnit, TimeResolvable } from './types';
import { HolyDuration } from './duration';

export class HolyTime {
  public static Units = TimeUnits;
  public static TimeZones = TIMEZONES;
  public static Days = DAY_NAMES;
  public static Months = MONTH_NAMES;
  private date: Date;

  constructor(initialDate: TimeResolvable = new Date()) {
    this.date = HolyTime.resolve(initialDate);
  }

  private static resolve(time: TimeResolvable): Date {
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

    const newTimeZone =
      TIMEZONE_MAP[timeZone as keyof typeof TIMEZONE_MAP] ?? timeZone;

    return new Date(date.toLocaleString('en-US', { timeZone: newTimeZone }));
  }

  private static getUnit(unit: HumanUnit): ValueOf<typeof HolyTime.Units> {
    const unitKey = unit
      .toUpperCase()
      .slice(0, -1) as keyof typeof HolyTime.Units;

    if (!HolyTime.Units[unitKey]) {
      throw new Error(`Invalid unit: ${unit}`);
    }

    return HolyTime.Units[unitKey];
  }

  public static isValid(time: TimeResolvable): boolean {
    return !Number.isNaN(HolyTime.resolve(time).getTime());
  }

  public static now(): HolyTime {
    return new HolyTime();
  }

  public static add(
    time: TimeResolvable,
    amount: number,
    unit: HumanUnit = 'milliseconds',
  ): HolyTime {
    return new HolyTime(
      HolyTime.resolve(time).getTime() + amount * HolyTime.getUnit(unit),
    );
  }

  public add(amount: number, unit: HumanUnit = 'milliseconds'): this {
    this.date = new Date(this.date.getTime() + amount * HolyTime.getUnit(unit));
    return this;
  }

  public static subtract(
    time: TimeResolvable,
    amount: number,
    unit: HumanUnit = 'milliseconds',
  ): HolyTime {
    return HolyTime.add(time, -amount, unit);
  }

  public subtract(amount: number, unit: HumanUnit = 'milliseconds'): this {
    return this.add(-amount, unit);
  }

  public static in(amount: number, unit: HumanUnit = 'milliseconds'): HolyTime {
    return new HolyTime(
      Date.now() + amount * HolyTime.getUnit(unit ?? 'milliseconds'),
    );
  }

  public isSame(
    time: TimeResolvable,
    unit: IntervalUnit = 'millisecond',
  ): boolean {
    const resolved = new HolyTime(time);

    if (unit === 'millisecond') {
      return this.date.getTime() === resolved.getTime();
    }

    return this.startOf(unit).getTime() === resolved.startOf(unit).getTime();
  }

  public static isSame(
    timeA: TimeResolvable,
    timeB: TimeResolvable,
    unit: IntervalUnit = 'millisecond',
  ): boolean {
    return new HolyTime(timeA).isSame(timeB, unit);
  }

  public static isWeekend(time: TimeResolvable): boolean {
    const date = HolyTime.resolve(time);

    const weekDay = date.getDay();

    return weekDay === 6 || weekDay === 0;
  }

  public isWeekend(): boolean {
    return HolyTime.isWeekend(this);
  }

  public static isLeapYear(year: number): boolean {
    if (
      typeof year !== 'number' ||
      Number.isNaN(year) ||
      !Number.isFinite(year)
    ) {
      throw new TypeError('Invalid input: Year must be a finite number');
    }

    if (year < 0 || !Number.isInteger(year)) {
      throw new Error('Invalid input: Year must be a positive integer');
    }

    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  public isLeapYear(time: TimeResolvable): boolean {
    return HolyTime.isLeapYear(HolyTime.resolve(time).getFullYear());
  }

  public static between(
    timeA: TimeResolvable,
    timeB: TimeResolvable,
  ): HolyDuration {
    return HolyTime.duration(
      Math.abs(
        HolyTime.resolve(timeA).getTime() - HolyTime.resolve(timeB).getTime(),
      ),
    );
  }

  public static isAfter(timeA: TimeResolvable, timeB: TimeResolvable): boolean {
    return (
      HolyTime.resolve(timeA).getTime() > HolyTime.resolve(timeB).getTime()
    );
  }

  public isAfter(time: TimeResolvable): boolean {
    return this.date.getTime() > HolyTime.resolve(time).getTime();
  }

  public static isBefore(
    timeA: TimeResolvable,
    timeB: TimeResolvable,
  ): boolean {
    return (
      HolyTime.resolve(timeA).getTime() < HolyTime.resolve(timeB).getTime()
    );
  }

  public isBefore(time: TimeResolvable): boolean {
    return this.date.getTime() < HolyTime.resolve(time).getTime();
  }

  public static isFuture(time: TimeResolvable): boolean {
    return HolyTime.isAfter(time, new Date());
  }

  public isFuture(): boolean {
    return this.isAfter(new Date());
  }

  public static isPast(time: TimeResolvable): boolean {
    return HolyTime.isBefore(time, new Date());
  }

  public isPast(): boolean {
    return this.isBefore(new Date());
  }

  public static since(time: TimeResolvable): HolyDuration {
    return new HolyDuration(Date.now() - HolyTime.resolve(time).getTime());
  }

  public static max(...times: TimeResolvable[]): HolyTime {
    return new HolyTime(
      Math.max(...times.map((time) => HolyTime.resolve(time).getTime())),
    );
  }

  public static min(...times: TimeResolvable[]): HolyTime {
    return new HolyTime(
      Math.min(...times.map((time) => HolyTime.resolve(time).getTime())),
    );
  }

  public static startOf(
    unit: IntervalUnit,
    time: TimeResolvable = new Date(),
    timeZone?: TimeZone,
  ): HolyTime {
    const resolved = HolyTime.resolve(time);
    resolved.setMilliseconds(0);

    const date = HolyTime.adjustToTimeZone(resolved, timeZone);
    const offset =
      HolyTime.between(date, time).in('milliseconds') *
      (HolyTime.isBefore(date, time) ? 1 : -1);

    switch (unit) {
      case 'millisecond': {
        return new HolyTime(date);
      }

      case 'second':
        return new HolyTime(
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
          ),
        );

      case 'minute':
        return new HolyTime(
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
          ),
        );

      case 'hour':
        return new HolyTime(
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
          ),
        ).add(offset);

      case 'day':
        return new HolyTime(
          new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        ).add(offset);

      case 'week':
        return new HolyTime(
          new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        )
          .subtract(date.getDay(), 'days')
          .add(offset);

      case 'month':
        return new HolyTime(new Date(date.getFullYear(), date.getMonth())).add(
          offset,
        );

      case 'year':
        return new HolyTime(new Date(date.getFullYear(), 0)).add(offset);
    }
  }

  public startOf(unit: IntervalUnit, timeZone?: TimeZone): HolyTime {
    return HolyTime.startOf(unit, this, timeZone);
  }

  public static endOf(
    unit: IntervalUnit,
    time: TimeResolvable = new Date(),
    timeZone?: TimeZone,
  ): HolyTime {
    const resolved = HolyTime.resolve(time);
    resolved.setMilliseconds(0);

    const date = HolyTime.adjustToTimeZone(resolved, timeZone);
    const offset =
      HolyTime.between(date, time).in('milliseconds') *
      (HolyTime.isBefore(date, time) ? 1 : -1);

    switch (unit) {
      case 'millisecond': {
        return new HolyTime(date);
      }

      case 'second': {
        return HolyTime.startOf('second', date)
          .add(HolyTime.Units.SECOND)
          .subtract(HolyTime.Units.MILLISECOND);
      }

      case 'minute':
        return HolyTime.startOf('minute', date)
          .add(HolyTime.Units.MINUTE)
          .subtract(HolyTime.Units.MILLISECOND);

      case 'hour':
        return HolyTime.startOf('hour', date)
          .add(HolyTime.Units.HOUR)
          .subtract(HolyTime.Units.MILLISECOND)
          .add(offset);

      case 'day':
        return HolyTime.startOf('day', date)
          .add(HolyTime.Units.DAY)
          .subtract(HolyTime.Units.MILLISECOND)
          .add(offset);

      case 'week':
        return HolyTime.startOf('week', date)
          .add(HolyTime.Units.WEEK)
          .subtract(HolyTime.Units.MILLISECOND)
          .add(offset);

      case 'month': {
        if (date.getMonth() === 11) {
          return new HolyTime(new Date(date.getFullYear() + 1, 0))
            .subtract(HolyTime.Units.MILLISECOND)
            .add(offset);
        }

        return new HolyTime(new Date(date.getFullYear(), date.getMonth() + 1))
          .subtract(HolyTime.Units.MILLISECOND)
          .add(offset);
      }

      case 'year':
        return new HolyTime(new Date(date.getFullYear() + 1, 0))
          .subtract(HolyTime.Units.MILLISECOND)
          .add(offset);
    }
  }

  public endOf(unit: IntervalUnit, timeZone?: TimeZone): HolyTime {
    return HolyTime.endOf(unit, this, timeZone);
  }

  public static format(
    time: TimeResolvable,
    format: string | ((time: HolyTime) => string),
    timeZone?: TimeZone,
  ): string {
    const resolvedDate = HolyTime.resolve(time);
    const utcDate = HolyTime.adjustToTimeZone(resolvedDate, 'UTC');
    const date = HolyTime.adjustToTimeZone(resolvedDate, timeZone);
    const timeZoneOffset =
      Math.round(HolyTime.between(date, utcDate).in('minutes')) *
      (HolyTime.isAfter(date, utcDate) ? -1 : +1);

    if (typeof format === 'function') {
      return format(new HolyTime(date));
    }

    const values: Record<string, string> = {
      YY: date.getFullYear().toString().slice(2, 4),
      YYYY: date.getFullYear().toString(),
      M: (date.getMonth() + 1).toString(),
      MM: (date.getMonth() + 1).toString().padStart(2, '0'),
      MMM: MONTH_NAMES[date.getMonth()].slice(0, 3),
      MMMM: MONTH_NAMES[date.getMonth()],
      D: date.getDate().toString(),
      DD: date.getDate().toString().padStart(2, '0'),
      DDDD: DAY_NAMES[date.getDay()],
      HH: date.getHours().toString().padStart(2, '0'),
      H: date.getHours().toString(),
      hh: (date.getHours() % 12 ? date.getHours() % 12 : 12)
        .toString()
        .padStart(2, '0'),
      h: (date.getHours() % 12 ? date.getHours() % 12 : 12).toString(),
      A: date.getHours() >= 12 ? 'PM' : 'AM',
      a: date.getHours() >= 12 ? 'pm' : 'am',
      m: date.getMinutes().toString(),
      mm: date.getMinutes().toString().padStart(2, '0'),
      s: date.getSeconds().toString(),
      ss: date.getSeconds().toString().padStart(2, '0'),
      O: `GMT${HolyTime.formatTimeZoneOffset(timeZoneOffset, false)}`,
      OO: `GMT${HolyTime.formatTimeZoneOffset(timeZoneOffset, true)}`,
      TZ:
        TIMEZONE_MAP[timeZone as keyof typeof TIMEZONE_MAP] ??
        timeZone ??
        HolyTime.getTimeZone(),
    };

    return format.replace(
      FORMAT_REGEX,
      (match, group) => group ?? values[match] ?? '?',
    );
  }

  private static formatTimeZoneOffset(offset: number, long: boolean): string {
    const sign = offset > 0 ? '-' : '+';

    const hours = long
      ? HolyTime.formatWithLeadingZeros(Math.trunc(Math.abs(offset) / 60), 2)
      : Math.trunc(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;

    return minutes === 0 && !long
      ? `${sign}${hours}`
      : `${sign}${hours}:${HolyTime.formatWithLeadingZeros(minutes, 2)}`;
  }

  private static formatWithLeadingZeros(
    number: number,
    length: number,
  ): string {
    const sign = number < 0 ? '-' : '';
    const output = Math.abs(number).toString().padStart(length, '0');

    return `${sign}${output}`;
  }

  public format(format: string, timeZone?: TimeZone): string {
    return HolyTime.format(this, format, timeZone);
  }

  public static relativeFromTo(
    timeA: TimeResolvable,
    timeB: TimeResolvable,
  ): string {
    const differance = HolyTime.between(timeA, timeB).in('milliseconds');
    const time = Math.max(
      ...Object.keys(RELATIVE_MAP)
        .map(Number)
        .filter((n) => n <= differance),
    );

    const format = RELATIVE_MAP[time];
    const future = HolyTime.isBefore(timeA, timeB);
    const output = typeof format === 'string' ? format : format(differance);

    return future ? `in ${output}` : `${output} ago`;
  }

  public static next(
    unit: IntervalUnit,
    time: TimeResolvable = new Date(),
    timeZone?: TimeZone,
  ): HolyTime {
    return HolyTime.endOf(unit, time, timeZone).add(HolyTime.Units.MILLISECOND);
  }

  public next(unit: IntervalUnit, timeZone?: TimeZone): HolyTime {
    return HolyTime.next(unit, this, timeZone);
  }

  public static duration(
    amount: number,
    unit: HumanUnit = 'milliseconds',
  ): HolyDuration {
    return new HolyDuration(amount * HolyTime.getUnit(unit));
  }

  public get<T extends 'object' | GetUnit>(
    unit: T,
    timeZone?: TimeZone,
  ): T extends 'object' ? Record<GetUnit, number> : number {
    const date = HolyTime.adjustToTimeZone(this.date, timeZone);

    const object: Record<GetUnit, number> = {
      millisecond: date.getMilliseconds(),
      second: date.getSeconds(),
      minute: date.getMinutes(),
      hour: date.getHours(),
      day: date.getDate(),
      week: Math.ceil(
        HolyTime.between(this.startOf('year', timeZone), date).in('weeks'),
      ),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };

    return unit === 'object' ? object : (object[unit as GetUnit] as any);
  }

  // TODO: rename type?
  public set(unit: GetUnit, value: number): this {
    switch (unit) {
      case 'millisecond':
        this.date.setMilliseconds(value);
        break;

      case 'second':
        this.date.setSeconds(value);
        break;

      case 'minute':
        this.date.setMinutes(value);
        break;

      case 'hour':
        this.date.setHours(value);
        break;

      case 'day':
        this.date.setDate(value);
        break;

      case 'week':
        this.date.setDate(value * 7);
        break;

      case 'month':
        this.date.setMonth(value - 1);
        break;

      case 'year':
        this.date.setFullYear(value);
        break;
    }

    return this;
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

  public static getTimeZone(): TimeZone {
    return Intl.DateTimeFormat().resolvedOptions().timeZone as TimeZone;
  }
}
