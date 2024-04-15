import LinkPlus from '@/components/navbar/link-plus';

interface FooterBoxProps {
  title?: string;
  navItems?: string[];
  extraClass?: string;
}

export function FooterBox(Props: FooterBoxProps) {
  const { title = 'Box Name', navItems = ['Home', 'Blog'], extraClass = '' } = Props;
  return (
    <div className={`${extraClass} size-min`}>
      <div className='flex break-inside-avoid flex-col'>
        <h3 className='pb-2 font-mono font-extrabold lowercase '>{title}</h3>
        <div className='flex flex-col space-y-2 text-2xl'>
          {navItems.map((item) => (
            <LinkPlus
              key={item.toLowerCase()}
              //prefetch={item.toLowerCase() === "home" ? false : true}
              href={item.toLowerCase() === 'home' ? '/' : `/${item.toLowerCase()}`}
              className='footer-nav-item'
            >
              {item === 'RSS' ? item : item.toLowerCase()}
            </LinkPlus>
          ))}
        </div>
      </div>
    </div>
  );
}

interface FooterBoxSpecialProps {
  title?: string;
  navItems?: {
    title: string;
    url: string;
  }[];
  extraClass?: string;
}

export function FooterBoxSpecial(Props: FooterBoxSpecialProps) {
  const {
    title = 'Box Name',
    navItems = [
      {
        title: 'Home',
        url: '/',
      },
      {
        title: 'GitHub',
        url: 'https://github.com',
      },
    ],
    extraClass = '',
  } = Props;
  return (
    <div className={`${extraClass} size-min`}>
      <div className='flex break-inside-avoid flex-col'>
        <h3 className='pb-2 font-mono font-extrabold lowercase '>{title}</h3>
        <div className='flex flex-col space-y-2'>
          {navItems.map((item) => (
            <a
              href={item.url}
              key={item.title.toLowerCase()}
              target='_blank'
              className='footer-nav-item'
              rel='noopener'
            >
              {item.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
