export const TimeUnits = {
  YEAR: 31_536_000_000,
  MONTH: 2_678_400_000,
  WEEK: 604_800_000,
  DAY: 86_400_000,
  HOUR: 3_600_000,
  MINUTE: 60_000,
  SECOND: 1000,
  MILLISECOND: 1,
} as const;

export const FORMAT_REGEX = /\[(?<escaped>[^\]]+)]|Y{4}|Y{2}|M{1,4}|D{1,2}|d{1,4}|h{1,2}|m{1,2}|s{1,2}/g;
export const MONTH_NAMES = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

export const RELATIVE_MAP: Record<number, string | ((milliseconds: number) => string)> = {
  [TimeUnits.SECOND * 0]: 'a few seconds',
  [TimeUnits.SECOND * 5]: (milliseconds) => `${Math.floor(milliseconds / TimeUnits.SECOND)} seconds`,
  [TimeUnits.MINUTE]: 'a minute',
  [TimeUnits.MINUTE * 2]: (milliseconds) => `${Math.floor(milliseconds / TimeUnits.MINUTE)} minutes`,
  [TimeUnits.HOUR]: 'an hour',
  [TimeUnits.HOUR * 2]: (milliseconds) => `${Math.floor(milliseconds / TimeUnits.HOUR)} hours`,
  [TimeUnits.DAY]: 'a day',
  [TimeUnits.DAY * 2]: (milliseconds) => `${Math.floor(milliseconds / TimeUnits.DAY)} days`,
  [TimeUnits.MONTH]: 'a month',
  [TimeUnits.MONTH * 2]: (milliseconds) => `${Math.floor(milliseconds / TimeUnits.MONTH)} months`,
  [TimeUnits.YEAR]: 'a year',
  [TimeUnits.YEAR * 2]: (milliseconds) => `${Math.floor(milliseconds / TimeUnits.YEAR)} years`,
};
