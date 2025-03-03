import { blog } from '$/.source';
import React from 'react'

function MDXComponent({ post }: { post: typeof blog[0] }) {
  const MDX = post.body
  // eslint-disable-next-line -- any is fine here.
  function ImageR2(props: any) {
    const url = `/_next/static/media/${encodeURIComponent(props.src.src.split('/server/assets/').pop())}?&q=75&w=${props.src.width}`
  
    if (props.src.src.includes('/server/assets')){
      // eslint-disable-next-line -- work around for next/image
      return <img src={url} alt={props.alt} />
    }
    // eslint-disable-next-line -- work around for next/image
    return <img {...props} />
  }
  // @ts-expect-error -- types issues
  return <MDX components={{ img: ImageR2 }} />
}

export async function renderStatic(post: typeof blog[0]) {
  const ReactDomServer = await import('react-dom/server');
  let render: string = '';
  try {
    render = ReactDomServer.renderToStaticMarkup(<MDXComponent post={post} />)
  } catch (err) {
    console.log(err);
  }
  return render
}



