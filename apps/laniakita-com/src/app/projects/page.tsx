export default function Page() {
  return (
    <div className='flex size-full h-screen max-h-[calc(100vh-3.9rem)] flex-col items-center justify-between md:flex-row lg:max-h-screen'>
      <div className='flex size-full flex-col items-center justify-center bg-ctp-base'>
        <h1 className='text-2xl font-black uppercase'>Dev Work</h1>
        <p>Coming Soon</p>
      </div>
      <div className='flex size-full flex-col items-center justify-center  bg-ctp-crust'>
        <h1 className='text-2xl font-black uppercase'>Artwork</h1>
        <p>Coming Soon</p>
      </div>
    </div>
  );
}
