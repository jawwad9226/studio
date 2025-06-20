import { format, subDays, parseISO } from 'date-fns';

export const getTodayDateString = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const getYesterdayDateString = (): string => {
  return format(subDays(new Date(), 1), 'yyyy-MM-dd');
};

export constformatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const getFormattedDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMMM d, yyyy');
  } catch (error) {
    return dateString; // Fallback if parsing fails
  }
};

export const getDaysArray = (startDateString: string, endDateString: string): string[] => {
  const dates: string[] = [];
  let currentDate = parseISO(startDateString);
  const endDate = parseISO(endDateString);

  while (currentDate <= endDate) {
    dates.push(format(currentDate, 'yyyy-MM-dd'));
    currentDate = subDays(currentDate, -1); // add 1 day
  }
  return dates;
};
