import RandomShader01 from '@/components/canvas/scenes/shaders/random';

export default function Home() {
  return (
    <main className='flex h-dvh w-full items-center justify-center'>
      <h1 className='absolute z-[2] uppercase'>Lani Akita</h1>
      <RandomShader01 />
    </main>
  );
}
