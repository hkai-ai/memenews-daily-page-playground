/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  typescript: {
    // 构建时忽略类型错误
    ignoreBuildErrors: true,
    ignoreDuringBuilds: true,
  },
  eslint: {
    // 构建时忽略 ESLint 错误
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
