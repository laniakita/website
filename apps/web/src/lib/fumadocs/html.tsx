import { blog } from '$/.source';
import React from 'react';

export async function renderStatic(post: (typeof blog)[0]) {
  const ReactDomServer = await import('react-dom/server');
  let render: string = '';
  try {
    render = ReactDomServer.renderToStaticMarkup(<MDXComponent post={post} />);
  } catch (err) {
    console.log(err);
  }
  return render;
}

function MDXComponent({ post }: { post: (typeof blog)[0] }) {
  const MDX = post.body;
    // @ts-expect-error -- types issues
  return <MDX components={{ img: ImageR2 }} />;
}

// eslint-disable-next-line -- any is fine here.
function ImageR2(props: any) {
    if (props.src.src) {
      // eslint-disable-next-line -- work around for next/image
      return <img src={props.src.src} alt={props.alt} width={props.src.width} height={props.src.height} />;
    }
    // eslint-disable-next-line -- work around for next/image
    return <img {...props} />;
  }

