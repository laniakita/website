import NoiseShader01 from "@/components/canvas/scenes/shaders/noise/noise";

export default function Home() {
  return (
    <main className='flex h-dvh w-full items-center justify-center'>
      <h1 className='absolute z-[2] uppercase'>Lani Akita</h1>
      <NoiseShader01 />
    </main>
  );
}
