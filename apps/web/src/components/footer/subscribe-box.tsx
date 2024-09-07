export default function FooterSubscribe() {
  return (
    <div className='relative z-10 flex w-full flex-col items-center justify-center px-2 py-4'>
      <div className='flex size-full max-w-3xl flex-col gap-4 rounded-xl border border-ctp-mauve bg-ctp-base p-4 supports-[text-wrap:pretty]:text-pretty'>
        <h3 className='text-4xl font-extrabold'>Stay up to date on all my latest dev ramblings!</h3>
        <h3 className='text-2xl font-light'>
          Subscribe to the newsletter to get posts, announcements, & more, right to your inbox.
        </h3>
        <div className='simple-color-trans flex w-full flex-row items-center justify-between overflow-x-hidden rounded-lg border border-ctp-surface0 bg-ctp-mantle p-2 text-2xl font-thin shadow-inner'>
          <p className='break-all'>urEmail@address.com</p>
          <div className='color-trans-2 flex items-center justify-center rounded-xl border border-ctp-surface0 p-2 text-3xl hover:bg-ctp-mauve hover:text-ctp-base hover:shadow-xl hover:shadow-ctp-mauve/30'>
            <span className='icon-[ph--arrow-circle-right-fill]' />
          </div>
        </div>
        <p className='font-mono text-xs supports-[text-wrap:pretty]:text-pretty'>
          By subscribing, you agree to laniakita.com&apos;s privacy policy and terms of service, to recieve an email
          newsletter that may or may not contain posts and or content you find interesting, that may or may not also
          contain posts and or content considered promotional.
        </p>
      </div>
    </div>
  );
}
