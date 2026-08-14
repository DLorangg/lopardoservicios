import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/sistema/', '/api/'],
    },
    sitemap: 'https://lopardoservicios.com/sitemap.xml',
  };
}
