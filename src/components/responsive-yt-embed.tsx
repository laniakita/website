export default function YTEmbed({ videoId }: { videoId: string }) {
  return (
    <div className='relative w-full overflow-hidden pt-[75%]'>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        className='absolute inset-0 size-full'
        title='YouTube video player'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        referrerPolicy='strict-origin-when-cross-origin'
        allowFullScreen
      />
    </div>
  );
}
