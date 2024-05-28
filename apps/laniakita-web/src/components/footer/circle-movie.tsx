interface CircleMovieProps {
  animationDelayJit?: string;
  colorClass?: string;
  animationClass?: string;
  posXClass?: string;
  posYClass?: string;
  heightClass?: string;
  widthClass?: string;
}

export default function CircleMove(Props: CircleMovieProps) {
  const {
    animationDelayJit = '[animation-delay:_1s]',
    colorClass = 'bg-ctp-red',
    animationClass = 'animate-growygrowsleft',
    posXClass = 'right-[10%]',
    posYClass = 'bottom-[10%]',
    heightClass = 'h-[8rem] md:h-[10rem]',
    widthClass = 'w-[8rem]  md:w-[10rem]',
  } = Props;
  return (
    <div
      className={`${animationDelayJit} ${colorClass} ${animationClass} ${posXClass} ${posYClass} ${heightClass} ${widthClass} absolute rounded-full motion-reduce:animate-none motion-reduce:transition-none`}
    />
  );
}
