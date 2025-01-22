import NoiseShader01 from './noise';

export default function NoiseShader1Page() {
  return (
    <div className='relative h-dvh min-h-[40rem] w-full'>
      <div className='absolute inset-0'>
        <NoiseShader01 />
      </div>
    </div>
  );
}
