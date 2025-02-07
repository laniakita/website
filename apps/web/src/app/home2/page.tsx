import { resMdxMinimal } from '@/lib/mdx-utils';
import { pageData } from './data';
import { ThreePage } from './three-page';
import { MiniMDXComponent } from '@/components/mdx/mini-mdx-component';

export default async function HomeV2() {
  const summary = await resMdxMinimal(pageData.summarySec);
  const profile = await resMdxMinimal(pageData.profileObj);
  const projects = await resMdxMinimal(pageData.projectSec);
  const works = await resMdxMinimal(pageData.workSec);
  const blog = await resMdxMinimal(pageData.blogSec);
  const ReactDomServer = await import('react-dom/server').then((res) => res.default);
  const data = {
    markdown: {
      summary: { code: ReactDomServer.renderToStaticMarkup(<MiniMDXComponent code={summary.code} />) },
      profile: { code: ReactDomServer.renderToStaticMarkup(<MiniMDXComponent code={profile.code} />) },
      projects: { code: ReactDomServer.renderToStaticMarkup(<MiniMDXComponent code={projects.code} />) },
      works: { code: ReactDomServer.renderToStaticMarkup(<MiniMDXComponent code={works.code} />) },
      blog: { code: ReactDomServer.renderToStaticMarkup(<MiniMDXComponent code={blog.code} />) },
    },
  };

  return <ThreePage data={data} />;
}
