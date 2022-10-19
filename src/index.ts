import { ValueOf } from 'type-fest';
import { TimeUnits } from './constants';

type TimeResolvable = HolyTime | Date | number | string;

type HumanUnitSingle = Lowercase<keyof typeof TimeUnits>;
type HumanUnitPlural = `${HumanUnitSingle}s`;
type HumanUnit = HumanUnitSingle | HumanUnitPlural;

type IntervalUnit = 'day' | 'week' | 'month' | 'year';

export default class HolyTime {
  public static Units = TimeUnits;
  private utc: boolean;
  private date: Date;

  constructor(initialDate: TimeResolvable = new Date(), utc = false) {
    this.date = HolyTime.resolveDate(initialDate);
    this.utc = utc;
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
    const key = unit.endsWith('s')
      ? unit.toUpperCase().slice(0, -1)
      : unit.toUpperCase();

    return HolyTime.Units[key as keyof typeof HolyTime.Units];
  }

  public static now(): HolyTime {
    return new HolyTime();
  }

  public UTC(): HolyTime {
    this.utc = true;
    return this;
  }

  public static add(time: TimeResolvable, amount: number, unit: HumanUnit = 'millisecond'): HolyTime {
    return new HolyTime(HolyTime.resolveDate(time).getTime() + (amount * HolyTime.getUnit(unit)));
  }

  public add(amount: number, unit: HumanUnit = 'millisecond'): this {
    this.date = new Date(this.date.getTime() + (amount * HolyTime.getUnit(unit)));
    return this;
  }

  public static subtract(time: TimeResolvable, amount: number, unit: HumanUnit = 'millisecond'): HolyTime {
    return HolyTime.add(time, -amount, unit);
  }

  public subtract(amount: number, unit: HumanUnit = 'millisecond'): this {
    return this.add(-amount, unit);
  }

  public static in(amount: number, unit: HumanUnit = 'millisecond'): HolyTime {
    return new HolyTime(Date.now() + (amount * HolyTime.getUnit(unit ?? 'millisecond')));
  }

  public static equals(timeA: TimeResolvable, timeB: TimeResolvable): boolean {
    return HolyTime.resolveDate(timeA).getTime() === HolyTime.resolveDate(timeB).getTime();
  }

  public equals(time: TimeResolvable): boolean {
    return this.date.getTime() === HolyTime.resolveDate(time).getTime();
  }

  public static isWeekend(time: TimeResolvable, utc = false): boolean {
    const date = HolyTime.resolveDate(time);

    const weekDay = utc
      ? date.getUTCDay()
      : date.getDay();

    return weekDay === 6 || weekDay === 0;
  }

  public isWeekend(): boolean {
    return HolyTime.isWeekend(this, this.utc);
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

  public static max(timeA: TimeResolvable, timeB: TimeResolvable): HolyTime {
    return HolyTime.resolveDate(timeA).getTime() > HolyTime.resolveDate(timeB).getTime()
      ? new HolyTime(timeA)
      : new HolyTime(timeB);
  }

  public static min(timeA: TimeResolvable, timeB: TimeResolvable): HolyTime {
    return HolyTime.resolveDate(timeA).getTime() < HolyTime.resolveDate(timeB).getTime()
      ? new HolyTime(timeA)
      : new HolyTime(timeB);
  }

  public static startOf(unit: IntervalUnit, time: TimeResolvable = new Date(), utc = false): HolyTime {
    let date = HolyTime.resolveDate(time);

    if (utc) {
      date = HolyTime.add(date, date.getTimezoneOffset() * HolyTime.Units.MINUTE).getDate();
    }

    switch (unit) {
      case 'day':
        return utc
          ? new HolyTime(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()), utc)
          : new HolyTime(new Date(date.getFullYear(), date.getMonth(), date.getDate()), utc);

      case 'week':
        return utc
          ? new HolyTime(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()), utc).subtract(date.getDay(), 'days')
          : new HolyTime(new Date(date.getFullYear(), date.getMonth(), date.getDate()), utc).subtract(date.getDay(), 'days');

      case 'month':
        return utc
          ? new HolyTime(Date.UTC(date.getFullYear(), date.getMonth()), utc)
          : new HolyTime(new Date(date.getFullYear(), date.getMonth()), utc);

      case 'year':
        return utc
          ? new HolyTime(Date.UTC(date.getFullYear(), 0), utc)
          : new HolyTime(new Date(date.getFullYear(), 0), utc);
    }
  }

  public startOf(unit: IntervalUnit): HolyTime {
    return HolyTime.startOf(unit, this, this.utc);
  }

  public static endOf(unit: IntervalUnit, time: TimeResolvable = new Date(), utc = false): HolyTime {
    let date = HolyTime.resolveDate(time);

    if (utc) {
      date = HolyTime.add(date, date.getTimezoneOffset() * HolyTime.Units.MINUTE).getDate();
    }

    switch (unit) {
      case 'day':
        return HolyTime.startOf('day', date, utc).add(HolyTime.Units.DAY).subtract(HolyTime.Units.MILLISECOND);

      case 'week':
        return HolyTime.startOf('week', date, utc).add(HolyTime.Units.WEEK).subtract(HolyTime.Units.MILLISECOND);

      case 'month': {
        if (date.getUTCMonth() === 11) {
          return utc
            ? new HolyTime(Date.UTC(date.getUTCFullYear() + 1, 0), utc).subtract(HolyTime.Units.MILLISECOND)
            : new HolyTime(new Date(date.getUTCFullYear() + 1, 0), utc).subtract(HolyTime.Units.MILLISECOND);
        }

        return utc
          ? new HolyTime(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1), utc).subtract(HolyTime.Units.MILLISECOND)
          : new HolyTime(new Date(date.getUTCFullYear(), date.getUTCMonth() + 1), utc).subtract(HolyTime.Units.MILLISECOND);
      }

      case 'year':
        return utc
          ? new HolyTime(Date.UTC(date.getUTCFullYear() + 1, 0), utc).subtract(HolyTime.Units.MILLISECOND)
          : new HolyTime(new Date(date.getUTCFullYear() + 1, 0), utc).subtract(HolyTime.Units.MILLISECOND);
    }
  }

  public endOf(unit: IntervalUnit): HolyTime {
    return HolyTime.endOf(unit, this, this.utc);
  }

  public static next(unit: IntervalUnit, time: TimeResolvable = new Date(), utc = false): HolyTime {
    return HolyTime.endOf(unit, time, utc).add(HolyTime.Units.MILLISECOND);
  }

  public next(unit: IntervalUnit): HolyTime {
    return HolyTime.next(unit, this, this.utc);
  }

  public getDate(): Date {
    return this.date;
  }

  public getTime(): number {
    return this.date.getTime();
  }

  public getISOString(): string {
    return this.date.toISOString();
  }
}
