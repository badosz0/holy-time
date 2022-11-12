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

## Usage
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

## Planned

- [ ] .set(unit, value)
- [ ] .get(unit)
- [ ] Documentation

## License

[MIT](https://tldrlegal.com/license/mit-license)
