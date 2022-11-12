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
