import { ValueOf } from 'type-fest';
import { HolyTime } from './time';
import { HumanUnit } from './types';

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
}

