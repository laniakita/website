'use client';
import { format } from 'date-fns';

export default function LocalDate({ date }: { date: Date | string }) {
  const getLocalTime = format(date, 'MMMM do, y');
  return <time dateTime={getLocalTime} suppressHydrationWarning>{getLocalTime}</time>;
}
