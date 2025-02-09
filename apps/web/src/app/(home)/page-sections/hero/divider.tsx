export default function HeroDivider({ hideMobile }: { hideMobile?: boolean }) {
  return (
    <div
      className={`${hideMobile ? 'hidden @3xl:block' : ''} mx-auto h-px w-full bg-ctp-text @3xl:mx-0 @3xl:h-auto @3xl:min-h-full @3xl:w-0.5 @3xl:overflow-visible`}
    />
  );
}
