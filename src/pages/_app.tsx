import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { withTRPC } from '@trpc/next'
import { AppRouter } from './api/trpc/[trpc]';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

function getBaseUrl() {
  if (typeof window) return ""; // Browser should use current path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}

export default withTRPC<AppRouter>({
  config() {
    const url = `${getBaseUrl()}/api/trpc`;
    return {
      // links: [
      //   httpBatchLink({
      //     url: '/api/trpc',
      //     maxBatchSize: 10,
      //   })
      // ],
      url,
    };
  },
  ssr: false,
})(MyApp);
