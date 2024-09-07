![holyTime](https://github.com/tomcru/holy-time/assets/35841182/51051dd9-d0db-4bf7-9cbd-21bcc8c98fd5)

# Holy Time

[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![NPM version](https://img.shields.io/npm/v/holy-time.svg?style=flat-square)](https://npmjs.org/package/holy-time)
[![JSR version](https://jsr.io/badges/@badosz/holy-time?style=flat-square)](https://jsr.io/@badosz/holy-time)

Yet another (type-safe) date time library.

## Installation

```bash
$ npm install holy-time
```

OR

```bash
$ yarn add holy-time
```

## Resources

- [Documentation](https://jsr.io/@badosz/holy-time/doc/~/default)

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
    HolyTime.add(HolyTime.startOf('day'), 2, 'hours'), 
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

