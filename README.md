#  Holy Time 🕑🙏

> Yet another (type-safe) date time library

## Installation

```bash
$ npm install holy-time
```

OR

```bash
$ yarn add holy-time
```

## Examples
```ts
import HolyTime from 'holy-time'

HolyTime
  .in(4, 'days')
  .add(2, 'weeks')
  .subtract(4, 'minutes')
  .isWeekend()

HolyTime.between(
  HolyTime.add(HolyTime.startOf('day'), 10_000), 
  HolyTime.now()
)

HolyTime.max(1666224000000, HolyTime.next('year'))

new HolyTime('2022-10-20')
  .UTC()
  .isAfter(
    HolyTime.subtract(
      HolyTime.in(4, 'days'), 
      8, 'weeks'
    )
  )

```
## Instance Methods
```ts
UTC(): this;

add(amount: number, unit: HumanUnit): this;
subtract(amount: number, unit: HumanUnit): this;

isWeekend(): boolean;
isAfter(time: TimeResolvable): boolean;
isBefore(time: TimeResolvable): boolean;
isEqual(time: TimeResolvable): boolean;

startOf(unit: IntervalUnit): HolyTime;
endOf(unit: IntervalUnit): HolyTime;
next(unit: IntervalUnit): HolyTime;

getDate(): Date;
getTime(): number;
getISOString(): string;

format(format: string): string;
getRelativeTo(time: TimeResolvable): string;
getRelativeFrom(time: TimeResolvable): string;
```

## Static Methods
```ts
now(): HolyTime;
in(amount: number, unit: HumanUnit): HolyTime

add(time: TimeResolvable, amount: number, unit: HumanUnit): HolyTime;
subtract(time: TimeResolvable, amount: number, unit: HumanUnit): HolyTime;

between(timeA: TimeResolvable, timeB: TimeResolvable): number;
since(time: TimeResolvable): number;

isWeekend(time: TimeResolvable, utc: boolean): boolean;
isAfter(timeA: TimeResolvable, timeB: TimeResolvable): boolean;
isBefore(timeA: TimeResolvable, timeB: TimeResolvable): boolean;
isEqual(timeA: TimeResolvable, timeB: TimeResolvable): boolean;

max(...times: TimeResolvable[]): HolyTime;
min(...times: TimeResolvable[]): HolyTime;

startOf(unit: IntervalUnit, time: TimeResolvable, utc: boolean): HolyTime;
endOf(unit: IntervalUnit, time: TimeResolvable, utc: boolean): HolyTime;
next(unit: IntervalUnit, time: TimeResolvable, utc: boolean): HolyTime;

format(time: TimeResolvable, format: string): string;
```


## Planned

- [ ] .set(unit, value)
- [ ] .get(unit)

## License

[MIT](https://tldrlegal.com/license/mit-license)
