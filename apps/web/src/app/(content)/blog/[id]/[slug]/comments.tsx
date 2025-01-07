'use client';

import Giscus from '@giscus/react';
import { useDarkStore } from '@/providers/theme-store-provider';

export default function CommentsComponent() {
  const { dark } = useDarkStore((state) => state);
  const themePref = () => {
    if (dark) {
      return 'https://giscus.catppuccin.com/themes/mocha.css';
    }
    return 'https://giscus.catppuccin.com/themes/latte.css';
  };
  return (
    <div className='size-full p-6'>
      <div className='mx-auto size-full max-w-3xl'>
        <Giscus
          id='comment'
          repo='laniakita/website'
          repoId='R_kgDOLYjaFQ'
          category='Announcements'
          categoryId='DIC_kwDOLYjaFc4Cf0F_'
          mapping='pathname'
          strict='0'
          reactionsEnabled='1'
          emitMetadata='1'
          inputPosition='top'
          theme={themePref()}
          lang='en'
          loading='lazy'
        />
      </div>
    </div>
  );
}
