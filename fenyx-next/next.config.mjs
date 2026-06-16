/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bilder kommen aktuell teils noch vom alten Webflow-CDN.
  // Diese Domains erlauben wir, damit <Image> sie laden darf.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.prod.website-files.com" },
    ],
  },
};

export default nextConfig;
