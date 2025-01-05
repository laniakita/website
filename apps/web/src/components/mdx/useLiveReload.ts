import { usePathname, useRouter } from 'next/navigation';
import { addMessageListener } from 'next/dist/client/dev/error-overlay/websocket';
// NOTE use ESM/CommonJS compat import here until resolved: https://github.com/facebook/react/issues/11503
import React from 'react';

/**
 * Needed as a work around for https://github.com/vercel/next.js/issues/19230
 * Just needed in cases where you're importing from `contentlayer/generated` and use the data directly in your
 * React components without going through `getStaticProps` or `getServerSideProps` first.
 */
export const useLiveReload = () => {
  const pathname = usePathname();
  const router = useRouter();

  // `router.asPath` needs to be stored in a ref since there's no way to "update" the event listener below
  const routePathRef = React.useRef<string | undefined>(pathname);
  React.useEffect(() => {
    routePathRef.current = pathname;
    console.log(pathname);
  }, [pathname]);

  React.useEffect(() => {
    let lastBuiltHash: string | undefined;

    // Based on this "implementation detail"
    // https://github.com/vercel/next.js/blob/canary/packages/next/client/dev/error-overlay/eventsource.js
    // eslint-disable-next-line -- any okay here
    addMessageListener((e: any) => {
      console.log('new event', e.type, e.data, e);

      const isRouteActive = routePathRef.current !== undefined;
      if (isRouteActive && e.type === 'message' && typeof e.data === 'string') {
        const data = JSON.parse(e.data);

        const dataHasChanged = data.hash !== lastBuiltHash && data.hash !== undefined;
        if ((data.action === 'built' || data.action === 'sync') && dataHasChanged) {
          router.push(routePathRef.current!, { scroll: false });

          lastBuiltHash = data.hash;
        }
      }
    });

    return () => {
      // NOTE given we can't remove the event listner above, we need this "mechanism" to short-circuit the event callback when the component has unmounted
      routePathRef.current = undefined;
    };

    /* eslint-disable react-hooks/exhaustive-deps */
  }, [routePathRef]);
};
