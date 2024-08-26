import { PageCommon } from '../../page-common';

export default function ContactPage({params}: {params: {slug: string;}}) {
  return (
    <PageCommon slug={params.slug} prefix='credits' />
  );
}
