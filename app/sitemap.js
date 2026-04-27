import { headers } from 'next/headers';

export default async function sitemap() {
  const host = (await headers()).get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  // Static routes
  const routes = ['', '/about', '/contact', '/shop', '/privacy', '/terms'].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: route === '' ? 1 : 0.8,
    })
  );

  // Dynamic product routes
  try {
    const res = await fetch(`${baseUrl}/api/toys?limit=1000`, { cache: 'no-store' });
    const data = await res.json();
    
    if (data && data.toys) {
      const productRoutes = data.toys.map((toy) => ({
        url: `${baseUrl}/shop/${toy._id}`,
        lastModified: new Date(toy.updatedAt || new Date()),
        changeFrequency: 'weekly',
        priority: 0.6,
      }));
      return [...routes, ...productRoutes];
    }
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }

  return routes;
}
