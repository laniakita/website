import type { Dispatch, SetStateAction, FormEvent, RefObject } from 'react'

export const DEFAULT_INSTANCE = 'mastodon.social'

export const ShareToMastodon = (formData: FormData, setShowMastodonForm: Dispatch<SetStateAction<boolean>>) => {

  const userInstance = formData.get("mastodon-instance");
  if (typeof userInstance === 'string' && userInstance.length > 0 && localStorage.getItem('mastodon-instance') !== userInstance) {
    // update localStorage
    localStorage.setItem('mastodon-instance', userInstance);
  };
  const localInstance = localStorage.getItem('mastodon-instance')

  const returnUrl = `https://${localInstance ?? DEFAULT_INSTANCE}/share?text=${encodeURIComponent(document.title)}%0A%0A${encodeURIComponent(location.href)}`

  window?.open(returnUrl, '_blank', 'noreferrer=true')?.focus();

  setShowMastodonForm(false);

}


export function MastodonBtn(
  { setShowMastodonForm }: { setShowMastodonForm: Dispatch<SetStateAction<boolean>>; }
) {

  //const [instance, setInstance] = useState('mastodon.social')
  //const mastodonBtn = useRef<HTMLAnchorElement>(null!);

  const handleClick = () => {
    setShowMastodonForm(true)
  }

  return (
    <>
      <button
        className='share-button hover:bg-[#563ACC]'
        onClick={handleClick}
        role='link'
        rel='noreferrer'
      >
        <span className='icon-[fa6-brands--mastodon] w-[2ch] text-xl' />
        <span>Mastodon</span>
      </button>

    </>
  )
}


export function MastodonPrompt({
  setShowMastodonForm,
  instanceInput,
  setInstanceInput,
  promptRef }: {
    setShowMastodonForm: Dispatch<SetStateAction<boolean>>;
    instanceInput: string;
    setInstanceInput: Dispatch<SetStateAction<string>>;
    promptRef: RefObject<HTMLDivElement>;
  }) {


  const localInstance = localStorage.getItem('mastodon-instance');

  return (
    <div className="fixed inset-0 z-20 flex h-screen w-screen items-center justify-center bg-ctp-midnight/50 backdrop-blur-sm">
      <div ref={promptRef} className='relative rounded-lg border border-ctp-overlay0 bg-ctp-base p-20 shadow-2xl dark:bg-ctp-midnight'>

        <button onClick={() => setShowMastodonForm(false)} className='group absolute -right-4 -top-4 flex items-center justify-center rounded-full border border-ctp-overlay0 bg-ctp-base shadow-lg'><span className='icon-[ph--x-circle] pointer-events-none z-[21] size-[4ch] text-ctp-text shadow-lg group-hover:icon-[ph--x-circle-fill] group-active:icon-[ph--x-circle-fill] group-hover:size-[4ch] group-active:size-[4ch]' /></button>
        <form action={(e) => ShareToMastodon(e, setShowMastodonForm)} className="flex flex-col gap-4">
          <label htmlFor="mastodon-instance" className="font-mono font-semibold" >curr_instance: {instanceInput.length > 0 ? instanceInput : localInstance && localInstance?.length > 0 ? localInstance : DEFAULT_INSTANCE}</label>
          <span className='relative flex flex-row'>
            <input id="mastodon-instance" name="mastodon-instance" type="text" placeholder={instanceInput.length > 0 ? instanceInput : localInstance && localInstance?.length > 0 ? localInstance : DEFAULT_INSTANCE} onChange={(e: FormEvent) => setInstanceInput((e.target as HTMLInputElement).value)} className='rounded-lg border border-ctp-surface0 p-4 font-mono placeholder:font-mono placeholder:text-ctp-text/50'></input>
            <button type="submit" className="instance-share-button" aria-labelledby='mastodon-instance'>
              {`share`}
            </button>
          </span>
        </form>
      </div>
    </div>
  )
}
