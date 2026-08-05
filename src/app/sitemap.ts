import { MetadataRoute } from "next";
import { connectDB } from "@/lib/db/mongoose";
import Scheme from "@/models/Scheme";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://yojnasaarthi.in";

  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/assistant`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ];

  // Dynamic scheme routes
  let schemeRoutes: MetadataRoute.Sitemap = [];
  try {
    await connectDB();
    const schemes = await Scheme.find({}, "slug updatedAt").lean();
    schemeRoutes = schemes.map((scheme: any) => ({
      url: `${baseUrl}/schemes/${scheme.slug}`,
      lastModified: scheme.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Failed to fetch sitemap routes:", error);
  }

  return [...staticRoutes, ...schemeRoutes];
}
