![holyTime](https://github.com/tomcru/holy-time/assets/35841182/51051dd9-d0db-4bf7-9cbd-21bcc8c98fd5)

<h1>Holy Time</h1>
<a href="https://www.npmjs.com/package/holy-time"><img src="https://img.shields.io/npm/v/holy-time.svg?style=flat" /></a>
<br>
<br>

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

HolyTime
  .between(
    HolyTime.add(HolyTime.startOf('day'), 10_000), 
    HolyTime.now()
  )
  .in('hours')

HolyTime.max(1666224000000, HolyTime.next('year'))

new HolyTime('2022-10-20')
  .isAfter(
    HolyTime.subtract(
      HolyTime.in(4, 'days'), 
      8, 'weeks'
    )
  )

HolyTime
  .duration(2, 'hours')
  .add(30, 'minutes')
  .in('seconds')

```
## Instance Methods
```ts
add(amount: number, unit: HumanUnit): this;
subtract(amount: number, unit: HumanUnit): this;

isLeapYear(): boolean;
isWeekend(): boolean;
isAfter(time: TimeResolvable): boolean;
isBefore(time: TimeResolvable): boolean;
isEqual(time: TimeResolvable): boolean;

startOf(unit: IntervalUnit, timeZone?: TimeZone): HolyTime;
endOf(unit: IntervalUnit, timeZone?: TimeZone): HolyTime;
next(unit: IntervalUnit, timeZone?: TimeZone): HolyTime;

getDate(): Date;
getTime(): number;
getISOString(): string;

format(format: string, timeZone?: TimeZone): string;
getRelativeTo(time: TimeResolvable): string;
getRelativeFrom(time: TimeResolvable): string;
```

## Static Methods
```ts
now(): HolyTime;
in(amount: number, unit: HumanUnit): HolyTime

add(time: TimeResolvable, amount: number, unit: HumanUnit): HolyTime;
subtract(time: TimeResolvable, amount: number, unit: HumanUnit): HolyTime;

between(timeA: TimeResolvable, timeB: TimeResolvable): HolyDuration;
since(time: TimeResolvable): number;

isLeapYear(time: TimeResolvable): boolean;
isWeekend(time: TimeResolvable): boolean;
isAfter(timeA: TimeResolvable, timeB: TimeResolvable): boolean;
isBefore(timeA: TimeResolvable, timeB: TimeResolvable): boolean;
isEqual(timeA: TimeResolvable, timeB: TimeResolvable): boolean;

max(...times: TimeResolvable[]): HolyTime;
min(...times: TimeResolvable[]): HolyTime;

startOf(unit: IntervalUnit, time: TimeResolvable, timeZone?: TimeZone): HolyTime;
endOf(unit: IntervalUnit, time: TimeResolvable, timeZone?: TimeZone): HolyTime;
next(unit: IntervalUnit, time: TimeResolvable, timeZone?: TimeZone): HolyTime;

format(time: TimeResolvable, format: string, timeZone?: TimeZone): string;
relativeFromTo(timeA: TimeResolvable, timeB: TimeResolvable): string;

duration(amount: number, unit: HumanUnit): HolyDuration;
```

## License

[MIT](https://tldrlegal.com/license/mit-license)
