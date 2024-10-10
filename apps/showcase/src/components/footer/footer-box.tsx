import Link from 'next/link';
import LinkPlus from '@/components/navbar/link-plus';
import { MAIN_SITE_URL } from '@/lib/constants';

interface FooterBoxProps {
  title?: string;
  navItems?: string[];
  extraClass?: string;
}

export function FooterBox(Props: FooterBoxProps) {
  const { title = 'Box Name', navItems = ['Home', 'Blog'], extraClass = '' } = Props;
  function handleRef(pageStr: string) {
    if (pageStr.toLowerCase() === 'home') {
      return MAIN_SITE_URL;
    } else if (pageStr.toLowerCase() === 'atom/rss') {
      return `${MAIN_SITE_URL}/atom.xml`;
    } else if (pageStr.toLowerCase() === 'résumé') {
      return `${MAIN_SITE_URL}/resume`;
    }
    return `${MAIN_SITE_URL}/${pageStr.toLowerCase()}`;
  }
  return (
    <div className={`${extraClass} size-min`}>
      <div className='flex break-inside-avoid flex-col'>
        <h2 className='pb-2 font-mono font-extrabold lowercase'>{title}</h2>
        <div className='flex flex-col space-y-2 text-2xl'>
          {navItems.map((item) =>
            item === 'login' || item === 'subscribe' ? (
              <p key={navItems.indexOf(item)} className='capitalize text-ctp-surface0'>
                {item}
              </p>
            ) : (
              <LinkPlus
                key={navItems.indexOf(item)}
                //prefetch={item.toLowerCase() === "home" ? false : true}
                href={handleRef(item)}
                className='footer-nav-item w-fit'
                target={item === 'Atom/RSS' ? '_blank' : undefined}
              >
                {item === 'Atom/RSS' ? item : item.toLowerCase()}
              </LinkPlus>
            ),
          )}
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
    <div className={extraClass}>
      <div className='flex break-inside-avoid flex-col'>
        <h3 className='pb-2 font-mono font-extrabold lowercase'>{title}</h3>
        <div className='flex flex-col space-y-2'>
          {navItems.map((item) => (
            <Link
              rel={item.title.toLowerCase() === 'mastodon' ? 'me' : ''}
              href={item.url}
              key={item.title.toLowerCase()}
              target='_blank'
              className='footer-nav-item w-fit whitespace-nowrap'
              type={item.url === '/atom.xml' ? 'application/atom+xml' : undefined}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
