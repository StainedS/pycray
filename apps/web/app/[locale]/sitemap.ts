import type { MetadataRoute } from 'next';

const sitemap = async (): Promise<MetadataRoute.Sitemap> => [
  {
    url: 'http://localhost:3001/',
    lastModified: new Date(),
  },
  {
    url: 'http://localhost:3001/events',
    lastModified: new Date(),
  },
];

export default sitemap;
