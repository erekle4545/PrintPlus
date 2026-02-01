import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack']
        });
        return config;
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
                pathname: '/storage/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
                pathname: '/uploads/**',
            },
        ],
    },
    // i18n config-ი სრულიად წაშალეთ - App Router-ში არ გამოიყენება
};

export default nextConfig;
//
// import type { NextConfig } from "next";
//
// const nextConfig: NextConfig = {
//     //   Ignore ESLint errors during production builds
//     eslint: {
//         ignoreDuringBuilds: true,
//     },
//
//     //   Ignore TypeScript type errors during production builds
//     typescript: {
//         ignoreBuildErrors: true,
//     },
//
//     webpack(config) {
//         config.module.rules.push({
//             test: /\.svg$/,
//             issuer: /\.[jt]sx?$/,
//             use: ["@svgr/webpack"],
//         });
//         return config;
//     },
//
//     images: {
//         remotePatterns: [
//             {
//                 protocol: "https",
//                 hostname: "api.printplus.ge",
//                 pathname: "/storage/**",
//             },
//             {
//                 protocol: "https",
//                 hostname: "api.printplus.ge",
//                 pathname: "/uploads/**",
//             },
//         ],
//     },
// };
//
// export default nextConfig;