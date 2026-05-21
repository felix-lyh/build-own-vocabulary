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
    typescript: {
        ignoreBuildErrors: false,
    },
    // i18n: {
    //     locales: ['en', 'zh'], // your supported locales
    //     defaultLocale: 'en',   // fallback locale
    // },
};

export default nextConfig;
