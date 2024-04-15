//import AnimateOnScroll from "./AnimateOnScroll"

interface SocialSplitterUltraProps {
  boxItems: SocialNavIcon[];
  hxw?: string;
  animClass?: string;
  textSize?: string;
}

interface SocialNavIcon {
  title: string;
  url: string;
  iconName: string;
  textSize: string;
}

export default function SocialIconNavSplitterUltra({
  boxItems,
  hxw,
  animClass,
  textSize,
  ...props
}: SocialSplitterUltraProps) {
  return (
    <div className='flex flex-wrap items-center gap-2' {...props}>
      {boxItems.map((item, index) => {
        return (
          <a
            key={boxItems.indexOf(item)}
            href={item.url}
            className={`${hxw} social-button ${animClass} ${textSize}`}
            style={{ animationDelay: `${0.5 + index / 10  }s` }}
            target='_blank' rel="noopener"
          >
            <span className={`${item.iconName} ${item.textSize}`} />
          </a>
        );
      })}
    </div>
  );
}

/*
interface TextSplitterUltraOnScrollProps extends ComponentProps<"span"> {
  textIn: string,
  spanRole: string,
  charClassIn: string,
  charClassOut: string,
}

export function TextSplitterUltraOnScroll({ textIn, spanRole, charClassIn, charClassOut, ...spanProps }: TextSplitterUltraOnScrollProps) {
  return (
    <span aria-label={textIn} role={spanRole} {...spanProps}>
      {textIn.split('').map(function(char, index) {
        return <AnimateOnScroll key={index} classNameInView={`${ char == ' ' ? 'mx-[0.2rem]' : '' } ${charClassIn}`} classNameOutOfView={charClassOut} style={{ animationDelay: (0.5 + index / 10) + "s" }} ><span>{char}</span></AnimateOnScroll>
      })}
    </span>
  )
} */
