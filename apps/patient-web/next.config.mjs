/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/for-diaspora", destination: "/diaspora", permanent: true },
      { source: "/for-doctors", destination: "/doctors", permanent: true },
      { source: "/for-care-partners", destination: "/family-plans", permanent: true },
      { source: "/for-pharmacies", destination: "/pharmacies", permanent: true },
      { source: "/for-labs", destination: "/laboratories", permanent: true },
      { source: "/for-employers", destination: "/employers", permanent: true },
      { source: "/for-hmos", destination: "/hmos", permanent: true },
      {
        source: "/for-hospitals",
        destination: "/hospitals-and-referrals",
        permanent: true
      },
      { source: "/trust-safety", destination: "/trust-and-safety", permanent: true },
      { source: "/login", destination: "/sign-in", permanent: true },
      { source: "/register", destination: "/create-account", permanent: true },
      { source: "/help", destination: "/contact", permanent: true },
      { source: "/patient", destination: "/patients", permanent: true }
    ];
  }
};

export default nextConfig;
