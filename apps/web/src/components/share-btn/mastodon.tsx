import type { Dispatch, SetStateAction, FormEvent, RefObject } from 'react';

export const DEFAULT_INSTANCE = 'mastodon.social';

export const ShareToMastodon = (formData: FormData, setShowMastodonForm: Dispatch<SetStateAction<boolean>>) => {
  const userInstance = formData.get('mastodon-instance');
  if (
    typeof userInstance === 'string' &&
    userInstance.length > 0 &&
    localStorage.getItem('mastodon-instance') !== userInstance
  ) {
    // update localStorage
    localStorage.setItem('mastodon-instance', userInstance);
  }
  const localInstance = localStorage.getItem('mastodon-instance');

  const returnUrl = `https://${localInstance ?? DEFAULT_INSTANCE}/share?text=${encodeURIComponent(document.title)}%0A%0A${encodeURIComponent(location.href)}`;

  window?.open(returnUrl, '_blank', 'noreferrer=true')?.focus();

  setShowMastodonForm(false);
};

export function MastodonBtn({ setShowMastodonForm }: { setShowMastodonForm: Dispatch<SetStateAction<boolean>> }) {
  //const [instance, setInstance] = useState('mastodon.social')
  //const mastodonBtn = useRef<HTMLAnchorElement>(null!);

  const handleClick = () => {
    setShowMastodonForm(true);
  };

  return (
    <>
      <button className='share-button hover:bg-[#563ACC]' onClick={handleClick} role='link' rel='noreferrer'>
        <span className='icon-[fa6-brands--mastodon] w-[2ch] text-xl' />
        <span>Mastodon</span>
      </button>
    </>
  );
}

export function MastodonPrompt({
  setShowMastodonForm,
  instanceInput,
  setInstanceInput,
  promptRef,
}: {
  setShowMastodonForm: Dispatch<SetStateAction<boolean>>;
  instanceInput: string;
  setInstanceInput: Dispatch<SetStateAction<string>>;
  promptRef: RefObject<HTMLDivElement>;
}) {
  const localInstance = localStorage.getItem('mastodon-instance');

  return (
    <div className='fixed inset-0 z-[11] flex h-screen w-screen items-center justify-center bg-ctp-midnight/50 px-3 backdrop-blur-sm'>
      <div
        ref={promptRef}
        className='relative rounded-lg border border-ctp-overlay0 bg-ctp-base p-10 opacity-0 shadow-2xl motion-safe:animate-fade-in-up md:p-20 dark:bg-ctp-midnight'
      >
        <button
          onClick={() => setShowMastodonForm(false)}
          className='group absolute -top-2 -right-2 flex items-center justify-center rounded-full border border-ctp-overlay0 bg-ctp-base text-ctp-text shadow-lg hover:bg-ctp-red hover:text-ctp-base hover:shadow-lg hover:shadow-ctp-red/30 active:bg-ctp-red active:text-ctp-base active:shadow-lg active:shadow-ctp-red/30 motion-safe:color-trans-2-quick md:-top-4 md:-right-4'
        >
          <span className='pointer-events-none z-[21] icon-[ph--x-circle] size-[3ch] shadow-lg md:size-[4ch]' />
        </button>
        <form action={(e) => ShareToMastodon(e, setShowMastodonForm)} className='flex flex-col gap-4'>
          <label htmlFor='mastodon-instance' className='font-mono font-semibold'>
            mastodon_server:{' '}
            {instanceInput.length > 0
              ? instanceInput
              : localInstance && localInstance?.length > 0
                ? localInstance
                : DEFAULT_INSTANCE}
          </label>
          <span className='relative flex flex-row'>
            <input
              id='mastodon-instance'
              name='mastodon-instance'
              type='text'
              placeholder={
                instanceInput.length > 0
                  ? instanceInput
                  : localInstance && localInstance?.length > 0
                    ? localInstance
                    : DEFAULT_INSTANCE
              }
              onChange={(e: FormEvent) => setInstanceInput((e.target as HTMLInputElement).value)}
              className='w-full rounded-lg border border-ctp-surface0 p-4 font-mono placeholder:font-mono placeholder:text-ctp-text/50'
            ></input>
            <button type='submit' className='instance-share-button' aria-labelledby='mastodon-instance'>
              {`share`}
            </button>
          </span>
        </form>
      </div>
    </div>
  );
}
