![holyTime](https://github.com/tomcru/holy-time/assets/35841182/51051dd9-d0db-4bf7-9cbd-21bcc8c98fd5)

[![License: MIT][license-image]][license-url]
[![NPM version][npm-image]][npm-url]
[![JSR version][jsr-image]][jsr-url]

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

## License

[MIT](https://tldrlegal.com/license/mit-license)

[license-image]: https://img.shields.io/badge/License-MIT-brightgreen.svg?style=flat-square
[license-url]: https://opensource.org/licenses/MIT
[npm-image]: https://img.shields.io/npm/v/holy-time.svg?style=flat-square
[npm-url]: https://npmjs.org/package/holy-time
[jsr-image]: https://jsr.io/badges/@badosz/holy-time?style=flat-square
[jsr-url]: https://jsr.io/@badosz/holy-time
