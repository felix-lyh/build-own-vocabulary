import type { NextConfig } from "next";
const nextConfig: NextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/vocabulary',
                permanent: true,
            },
        ];
    },
    // Since the extension not spport http,so I set a proxy to forward the request to the backend server.
    async rewrites() {
        if (process.env.NODE_ENV !== 'development') return [];

        return [
            {
                source: '/api/:path*',
                destination: 'http://120.79.241.153/api/:path*',
            },
        ];
    },
    typescript: {
        ignoreBuildErrors: false,
    },
    // i18n: {
    //     locales: ['en', 'zh'], // your supported locales
    //     defaultLocale: 'en',   // fallback locale
    // },
};

export default nextConfig;
