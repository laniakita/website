'use client';
import { format } from 'date-fns';

export default function LocalDate({ date }: { date: Date }) {
  const getLocalTime = format(date, 'MMMM do, y');
  return <time>{getLocalTime}</time>;
}
