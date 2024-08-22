import Markdown from 'markdown-to-jsx';
import Link from 'next/link';

const blogInfo = `A blog about life, Linux, and web development, written by, [Lani Akita](/about).`;

export default function Sidebar() {
  return (
    <>
      {/* wrapper */}
      <div className=''>
        <div className='sidebar-box'>
          <div className='prose-protocol-omega font-mono prose-p:my-0'>
            <Markdown options={{ forceBlock: true }}>{blogInfo}</Markdown>
          </div>
        </div>
      </div>
    </>
  );
}
