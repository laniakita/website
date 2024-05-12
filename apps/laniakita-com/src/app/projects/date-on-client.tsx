import dayjs, { extend } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';
import type { WorkMetaProps } from './page';

extend(relativeTime);
extend(localizedFormat);
extend(timezone);

export default function DateOnClient({
  frontmatter,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- any is needed here to make mdx-bundler types happy
  frontmatter: Record<string, any>;
}) {
  const published = dayjs((frontmatter as WorkMetaProps).published).format('L');
  const updated = dayjs((frontmatter as WorkMetaProps).updated).format('L');

  return (
    <div className='font-mono text-lg'>
      <p className=''>
        Published: <span className='font-semibold'>{published}</span>
      </p>
      {(updated as unknown) !== undefined && published !== updated && (
        <p className=''>
          Updated: <span className='font-semibold'>{updated}</span>
        </p>
      )}
    </div>
  );
}
