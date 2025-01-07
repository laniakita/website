'use client';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

export default function LocalDate({ date, tag }: { date: Date | string; tag?: boolean }) {

  const [localTime, setLocalTime] = useState(format(date, 'MMMM do, y'));

  useEffect(() => {
    const getLocalTime = format(date, 'MMMM do, y');
    setLocalTime(getLocalTime);
    
  }, [date]);

  return (
    <>
      {tag ? (
        <span suppressHydrationWarning>{localTime}</span>
      ) : (
        <time itemProp='datePublished' dateTime={localTime} suppressHydrationWarning>
          {localTime}
        </time>
      )}
    </>
  );
}
