export default function LoginGate() {
  return (
    <div className='fixed inset-0 z-50 flex min-h-screen w-full items-center justify-center bg-black/50 backdrop-blur-lg'>
      <form className='rounded-xl border border-ctp-base bg-ctp-crust p-10 shadow-2xl'>
        <div className='relative flex flex-row items-center'>
          <input
            id='passkey'
            name='passkey'
            placeholder='dev_key'
            className='w-full rounded-lg border border-ctp-surface0 bg-ctp-mantle px-4 py-4 font-mono text-ctp-text placeholder:text-ctp-surface2'
          />
          <button
            type='submit'
            className='absolute right-2 w-fit rounded-lg border border-ctp-blue bg-ctp-blue/30 px-4 py-2 text-center font-mono text-ctp-blue hover:border-ctp-sky hover:bg-ctp-sky/30 hover:text-ctp-sky'
          >
            unlock
          </button>
        </div>
      </form>
    </div>
  );
}
