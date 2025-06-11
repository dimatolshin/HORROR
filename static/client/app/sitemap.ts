import { MetadataRoute } from "next";
import { fetchHorrors, IHorrorsPromise } from "@/app/api/horrors/fetchHorrors";

const BASE_URL = "https://quest-house.by";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const horrors: IHorrorsPromise[] = await fetchHorrors();

  const horrorUrls = horrors.map((horror) => {
    return {
      url: `${BASE_URL}/horrors/${horror.id}`,

      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    };
  });

  const staticUrls = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
  ];

  return [...staticUrls, ...horrorUrls];
}
