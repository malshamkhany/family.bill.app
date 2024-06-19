/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: "export",
    basePath: "/family.bill.app",
    images: {
        loader: "akamai",
        path: "",
      },
};

export default nextConfig;
