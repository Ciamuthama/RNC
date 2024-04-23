/* eslint-disable prettier/prettier */
import { format, parseISO, isValid,getYear,getMonth,getDay,getTime } from 'date-fns';

export function padNumber(n:any) {
  return n < 10 ? '0' + n : n.toString();
}

export function dateToFnsData(date:any) {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsedDate)) {
    throw new Error('Invalid date');
  }
  const formattedDate = format(parsedDate, 'yyyy-MM-dd');
  return {
    year: getYear(parsedDate),
    month: getMonth(parsedDate) + 1,
    day: getDay(parsedDate),
    timestamp: getTime(parsedDate),
    dateString: formattedDate,
  };
}

export function parseDate(d:any) {
  if (!d) {
    return;
  } else if (typeof d === 'object' && 'timestamp' in d) {
    return new Date(d.timestamp);
  } else if (d instanceof Date) {
    return d;
  } else if (typeof d === 'string') {
    return parseISO(d);
  }
  throw new Error('Invalid date format');
}

export function toMarkingFormat(d:any) {
  if (!isNaN(getTime(d))) {
    const year = getYear(d);
    const month = padNumber(getMonth(d) + 1);
    const day = padNumber(getDay(d));
    return `${year}-${month}-${day}`;
  }
  return 'Invalid Date';
}
