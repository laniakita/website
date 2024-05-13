import dayjs, { extend } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';

extend(relativeTime);
extend(localizedFormat);
extend(timezone);

export default function DateOnClient({ date }: { date: Date }) {
  const published = dayjs(date).format('L');

  return <p className='font-mono text-lg font-semibold'>{published}</p>;
}
