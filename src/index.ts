import { ValueOf } from 'type-fest';
import { FORMAT_REGEX, MONTH_NAMES, RELATIVE_MAP, TimeUnits } from './constants';

type TimeResolvable = HolyTime | Date | number | string;
type HumanUnit = `${Lowercase<keyof typeof TimeUnits>}s`;

type IntervalUnit = 'hour' | 'day' | 'week' | 'month' | 'year';

export default class HolyTime {
  public static Units = TimeUnits;
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

  private static getUnit(unit: HumanUnit): ValueOf<typeof TimeUnits> {
    return HolyTime.Units[unit.toUpperCase().slice(0, -1) as keyof typeof HolyTime.Units];
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

  public static startOf(unit: IntervalUnit, time: TimeResolvable = new Date()): HolyTime {
    const date = HolyTime.resolveDate(time);

    switch (unit) {
      case 'hour':

        return new HolyTime(new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()));

      case 'day':
        return new HolyTime(new Date(date.getFullYear(), date.getMonth(), date.getDate()));

      case 'week':
        return new HolyTime(new Date(date.getFullYear(), date.getMonth(), date.getDate())).subtract(date.getDay(), 'days');

      case 'month':
        return new HolyTime(new Date(date.getFullYear(), date.getMonth()));

      case 'year':
        return new HolyTime(new Date(date.getFullYear(), 0));
    }
  }

  public startOf(unit: IntervalUnit): HolyTime {
    return HolyTime.startOf(unit, this);
  }

  public static endOf(unit: IntervalUnit, time: TimeResolvable = new Date()): HolyTime {
    const date = HolyTime.resolveDate(time);

    switch (unit) {
      case 'hour':
        return HolyTime.startOf('hour', date).add(HolyTime.Units.HOUR).subtract(HolyTime.Units.MILLISECOND);

      case 'day':
        return HolyTime.startOf('day', date).add(HolyTime.Units.DAY).subtract(HolyTime.Units.MILLISECOND);

      case 'week':
        return HolyTime.startOf('week', date).add(HolyTime.Units.WEEK).subtract(HolyTime.Units.MILLISECOND);

      case 'month': {
        if (date.getMonth() === 11) {
          return new HolyTime(new Date(date.getFullYear() + 1, 0)).subtract(HolyTime.Units.MILLISECOND);
        }

        return new HolyTime(new Date(date.getFullYear(), date.getMonth() + 1)).subtract(HolyTime.Units.MILLISECOND);
      }

      case 'year':
        return new HolyTime(new Date(date.getFullYear() + 1, 0)).subtract(HolyTime.Units.MILLISECOND);
    }
  }

  public endOf(unit: IntervalUnit): HolyTime {
    return HolyTime.endOf(unit, this);
  }

  public static format(time: TimeResolvable, format: string): string {
    const date = HolyTime.resolveDate(time);

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

  public format(format: string): string {
    return HolyTime.format(this, format);
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

  public static next(unit: IntervalUnit, time: TimeResolvable = new Date()): HolyTime {
    return HolyTime.endOf(unit, time).add(HolyTime.Units.MILLISECOND);
  }

  public next(unit: IntervalUnit): HolyTime {
    return HolyTime.next(unit, this);
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
