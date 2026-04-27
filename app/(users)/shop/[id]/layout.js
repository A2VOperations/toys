import { headers } from 'next/headers';

export async function generateMetadata({ params }) {
  const { id } = params;
  
  // Get the base URL from headers if available, or use a default
  const host = (await headers()).get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  try {
    const res = await fetch(`${baseUrl}/api/toys/${id}`, { cache: 'no-store' });
    const data = await res.json();
    
    if (data && data.toy) {
      const toy = data.toy;
      return {
        title: toy.title,
        description: toy.description ? toy.description.substring(0, 160) : `Buy ${toy.title} at Toys for Kids. Quality toys for children.`,
        openGraph: {
          title: toy.title,
          description: toy.description ? toy.description.substring(0, 160) : `Buy ${toy.title} at Toys for Kids.`,
          images: toy.images?.[0] ? [{ url: toy.images[0] }] : [],
        },
      };
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }

  return {
    title: "Product Details",
    description: "View product details on Toys for Kids.",
  };
}

export default function ProductLayout({ children }) {
  return <>{children}</>;
}
