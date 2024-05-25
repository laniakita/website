'use client';
import dayjs, { extend } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';

extend(relativeTime);
extend(localizedFormat);
extend(timezone);

export default function PostDate({ dateStr }: { dateStr: Date }) {
  const postedDate = dayjs(dateStr).format('L');
  return <time>{postedDate}</time>;
}
