import { ValueOf } from 'type-fest';
import { HolyTime } from './time';
import { HumanUnit } from './types';
import { TimeUnits } from './constants';

const UNIT_KEYS = Object.keys(TimeUnits).map((key) => key.toLowerCase());
const UNIT_VALUES = Object.values(TimeUnits);
const listFormatter = new Intl.ListFormat('en-GB', { type: 'conjunction' });

export class HolyDuration {
  private milliseconds: number;

  constructor(time: number) {
    this.milliseconds = time;
  }

  private static getUnit(unit: HumanUnit): ValueOf<typeof HolyTime.Units> {
    const unitKey = unit.toUpperCase().slice(0, -1) as keyof typeof HolyTime.Units;

    if (!HolyTime.Units.hasOwnProperty(unitKey)) {
      throw new Error(`Invalid unit: ${unit}`);
    }

    return HolyTime.Units[unitKey];
  }

  public add(amount: number, unit: HumanUnit = 'milliseconds'): this {
    this.milliseconds += amount * HolyDuration.getUnit(unit);
    return this;
  }

  public subtract(amount: number, unit: HumanUnit = 'milliseconds'): this {
    return this.add(-amount, unit);
  }

  public in(unit: HumanUnit): number {
    return this.milliseconds / HolyDuration.getUnit(unit);
  }

  public format(type: | 'short' | 'long' = 'short', maxSegments: number = Infinity): string {
    let segments: number[] = [];
    let { milliseconds } = this;

    for (const unit of UNIT_VALUES) {
      if (milliseconds >= unit) {
        segments.push(Math.floor(milliseconds / unit));
        milliseconds %= unit;
      } else {
        segments.push(0);
      }
    }

    segments = segments.slice(0, segments.findIndex(Boolean) + maxSegments);

    switch (type) {
      case 'short': {
        return segments
          .map((segment, i) => `${segment}${UNIT_KEYS[i][0]}${i === UNIT_KEYS.length - 1 ? 's' : ''}`)
          .filter(segment => !segment.startsWith('0'))
          .join(' ');
      }

      case 'long': {
        return listFormatter.format(
          segments
            .map((segment, i) => `${segment} ${UNIT_KEYS[i]}${segment === 1 ? '' : 's'}`)
            .filter(segment => !segment.startsWith('0')),
        );
      }
    }
  }
}

