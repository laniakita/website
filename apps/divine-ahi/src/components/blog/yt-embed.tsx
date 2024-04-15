function YTEmbed({ vidId }: { vidId: string }) {
  return (
    <div className='flex size-full '>
      <iframe
        src={`https://www.youtube.com/embed/${vidId}`}
        height={315}
        width={0}
        title='YouTube video player'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        referrerPolicy='strict-origin-when-cross-origin'
        allowFullScreen
        className='h-[215px] flex-auto sm:h-[400px] md:h-[500px]'
       />
    </div>
  );
}

export default YTEmbed;
