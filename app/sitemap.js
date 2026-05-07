import { headers } from "next/headers";

export default async function sitemap() {
  const host = (await headers()).get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  // Static routes with proper priority weighting
  const staticRoutes = [
    { url: `${baseUrl}/`, priority: 1.0, changeFrequency: "weekly" },
    { url: `${baseUrl}/shop`, priority: 0.9, changeFrequency: "daily" },
    { url: `${baseUrl}/contact`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${baseUrl}/about`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${baseUrl}/privacy`, priority: 0.3, changeFrequency: "yearly" },
    { url: `${baseUrl}/terms`, priority: 0.3, changeFrequency: "yearly" },
  ].map((route) => ({
    ...route,
    lastModified: new Date(),
  }));

  // Category routes — great for SEO, add as many as you have
  const categoryRoutes = [
    "toys",
    "return-gifts",
    "stationery",
    "school-bags",
    "educational-toys",
    "soft-toys",
    "outdoor-toys",
  ].map((category) => ({
    url: `${baseUrl}/shop/category/${category}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Dynamic product routes
  try {
    const res = await fetch(`${baseUrl}/api/toys?limit=1000`, {
      next: { revalidate: 3600 }, // ✅ cache for 1 hour instead of no-store
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const data = await res.json();

    if (data?.toys?.length) {
      const productRoutes = data.toys.map((toy) => ({
        // ✅ Use slug if available, fall back to _id only as last resort
        url: `${baseUrl}/shop/${toy.slug ?? toy._id}`,
        lastModified: toy.updatedAt ? new Date(toy.updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
      }));

      return [...staticRoutes, ...categoryRoutes, ...productRoutes];
    }
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  return [...staticRoutes, ...categoryRoutes];
}
