import { SubscribeBox } from '@/components/sidebar/main';
import PostPreviewV4 from './post-components';
import { blog } from '$/.source';

export default function PostRollerV4({ posts, isBlog }: { posts: typeof blog; isBlog?: boolean }) {
    
   return (
    <div className='flex items-center justify-center'>
      <div className='flex w-full max-w-3xl flex-col gap-4 md:gap-6'>
        {isBlog
          ? posts.map((post, idx) =>
              idx === 1 ? (
                <div key={crypto.randomUUID()} className='flex flex-col gap-4 md:gap-6'>
                  <SubscribeBox mobile />
                  <PostPreviewV4 post={post} />
                </div>
              ) : (
                <PostPreviewV4 key={crypto.randomUUID()} post={post} />
              ),
            )
          : posts.map((post) => <PostPreviewV4 key={crypto.randomUUID()} post={post} />)}
      </div>
    </div>
  );
}
