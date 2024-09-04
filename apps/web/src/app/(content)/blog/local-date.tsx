'use client';
import { format } from 'date-fns';

export default function LocalDate({ date, tag }: { date: Date | string; tag?: boolean }) {
  const getLocalTime = format(date, 'MMMM do, y');

  return (
    <>
      {tag ? (
        <span suppressHydrationWarning>{getLocalTime}</span>
      ) : (
        <time dateTime={getLocalTime} suppressHydrationWarning>
          {getLocalTime}
        </time>
      )}
    </>
  );
}
