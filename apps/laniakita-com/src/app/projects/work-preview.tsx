'use client';
import dayjs, { extend } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';
import type { WorkMetaProps } from '@/app/projects/page';

extend(relativeTime);
extend(localizedFormat);
extend(timezone);

export default function WorkPreview({ workMetaObj }: { workMetaObj: WorkMetaProps }) {
  const releaseDate = dayjs(workMetaObj.date).format('L');
  return (
    <>
      {/* neat css tip: use padding instead of margin when working with flex basis / flex grids */}
      <div className='flex w-full basis-full p-4 md:basis-1/2'>
        <div className='flex w-full flex-col gap-10 rounded-2xl border border-ctp-surface0 p-10'>
          <div className='h-96 rounded-xl bg-ctp-sapphire' />
          <div className='flex flex-col'>
            <h3 className='text-3xl font-black uppercase supports-[text-wrap:balance]:text-balance'>
              {workMetaObj.title}
            </h3>
            <div className='flex flex-row gap-2 font-mono text-sm'>
              <p>{releaseDate}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
