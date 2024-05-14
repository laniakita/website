import { toBase64Blur } from '@/utils/blur-util';
import type { PostTeaserObjectProps } from '@/utils/mdx-utils';
import { ClientBg } from './client-hero-v2';

export async function HeroWrapper({ dataObject }: { dataObject: PostTeaserObjectProps }) {
  const heroRes = await toBase64Blur(dataObject.heroFile!)
  return <ClientBg dataObject={dataObject} blurUrl={heroRes}  />;
}
