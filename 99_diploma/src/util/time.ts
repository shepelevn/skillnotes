import { randomInt } from "./randomInt";

export function getMonthsAgo(months: number): Date {
  const date = new Date();
  const month = date.getMonth();
  date.setMonth(date.getMonth() - months);

  // If still in same month, set date to last day of previous month
  if (date.getMonth() == month) date.setDate(0);

  date.setHours(0, 0, 0, 0);

  return date;
}

export function randomDate(start: number, end: number = Date.now()) {
  return new Date(randomInt(start, end));
}
