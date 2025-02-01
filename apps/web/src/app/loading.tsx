export default function Loading() {
  return (
    <div className='flex size-full min-h-screen items-center justify-center bg-ctp-base dark:bg-ctp-midnight'>
      <div role='status'>
        <span className='icon-[eos-icons--bubble-loading] size-12 fill-ctp-text md:size-20' />
        <span className='sr-only'>Loading...</span>
      </div>
    </div>
  );
}
