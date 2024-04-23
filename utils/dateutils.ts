/* eslint-disable prettier/prettier */
const {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isBefore,
  isAfter,
  isEqual,
  format,
  getMonth, 
  getYear,
  setDefaultOptions,
} = require('date-fns');

// console.log(startOfWeek(new Date()));
// console.log(endOfWeek(new Date()));



const { toMarkingFormat } = require('../interface');

export function sameMonth(a, b) {
  return getYear(a) === getYear(b) && getMonth(a) === getMonth(b);
}

export function sameDate(a, b) {
  return isEqual(a, b);
}

export function onSameDateRange({
  firstDay,
  secondDay,
  numberOfDays,
  firstDateInRange,
}: {
  firstDay: string;
  secondDay: string;
  numberOfDays: number;
  firstDateInRange: string;
}) {
  const aDate = new Date(firstDay);
  const bDate = new Date(secondDay);
  const firstDayDate = new Date(firstDateInRange);
  const aDiff = aDate.getTime() - firstDayDate.getTime();
  const bDiff = bDate.getTime() - firstDayDate.getTime();
  const aTotalDays = Math.ceil(aDiff / (1000 * 3600 * 24));
  const bTotalDays = Math.ceil(bDiff / (1000 * 3600 * 24));
  const aWeek = Math.floor(aTotalDays / numberOfDays);
  const bWeek = Math.floor(bTotalDays / numberOfDays);
  return aWeek === bWeek;
}

export function sameWeek(
  a: string | number,
  b: string | number,
  firstDayOfWeek: string | number
) {
  const aWeekStart = startOfWeek(new Date(a), { weekStartsOn: firstDayOfWeek });
  const aWeekEnd = endOfWeek(new Date(a), { weekStartsOn: firstDayOfWeek });
  const bDate = new Date(b);
  return isAfter(bDate, aWeekStart) && isBefore(bDate, aWeekEnd);
}

export function isPastDate(date: string | number | Date) {
  return isBefore(new Date(), new Date(date));
}

export function isToday(date: string | number | Date) {
  return isEqual(new Date(date), new Date());
}

export function isGTE(a: any, b: any) {
  return isAfter(a, b) || isEqual(a, b);
}

export function isLTE(a: any, b: any) {
  return isBefore(a, b) || isEqual(a, b);
}

export function formatNumbers(date: string | number | Date) {
  return format(new Date(date), 'dd-MM-yyyy');
}

export function month(date: string | number | Date) {
  const startDate = startOfMonth(new Date(date));
  const endDate = endOfMonth(new Date(date));
  const days = [];
  let currentDate = startDate;

  while (isBefore(currentDate, endDate) || isEqual(currentDate, endDate)) {
    days.push(currentDate);
    currentDate = addDays(currentDate, 1);
  }

  return days;
}

export function weekDayNames(firstDayOfWeek = 0) {
  const weekDaysNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayShift = firstDayOfWeek % 7;
  if (dayShift) {
    return weekDaysNames
      .slice(dayShift)
      .concat(weekDaysNames.slice(0, dayShift));
  }
  return weekDaysNames;
}

export function page(
  date: string | number | Date,
  firstDayOfWeek = 0,
  showSixWeeks = false
) {
  const days = month(date);
  const before = [];
  const after = [];

  const fdow = (7 + firstDayOfWeek) % 7 || 7;
  const ldow = (fdow + 6) % 7;

  const startDate = startOfWeek(days[0], { weekStartsOn: firstDayOfWeek });
  const endDate = endOfWeek(days[days.length - 1], {
    weekStartsOn: firstDayOfWeek,
  });

  let currentDate = startDate;

  while (isBefore(currentDate, endDate) || isEqual(currentDate, endDate)) {
    if (isBefore(currentDate, days[0]) || isEqual(currentDate, days[0])) {
      before.push(currentDate);
    } else if (
      isAfter(currentDate, days[days.length - 1]) ||
      isEqual(currentDate, days[days.length - 1])
    ) {
      after.push(currentDate);
    }
    currentDate = addDays(currentDate, 1);
  }

  return before.concat(days.slice(1, days.length - 1), after);
}

export function isDateNotInRange(date: any, minDate: any, maxDate: any) {
  return (
    (minDate && isBefore(date, new Date(minDate))) ||
    (maxDate && isAfter(date, new Date(maxDate)))
  );
}

export function getWeekDates(date: any, firstDay = 0, format) {
  const d = new Date(date);
  const weekDays = [];
  const weekStartDate = startOfWeek(d, { weekStartsOn: firstDay });

  for (let i = 0; i < 7; i++) {
    const currentDate = addDays(weekStartDate, i);
    weekDays.push(format ? format(currentDate, format) : currentDate);
  }

  return weekDays;
}

export function getPartialWeekDates(date: any, numberOfDays = 7) {
  const partialWeek = [];
  for (let i = 0; i < numberOfDays; i++) {
    const currentDate = addDays(new Date(date), i);
    partialWeek.push(currentDate);
  }
  return partialWeek;
}

export function generateDay(originDate: any, daysOffset = 0) {
  return toMarkingFormat(
    addDays(new Date(originDate), daysOffset),
    'yyyy-MM-dd'
  );
}
