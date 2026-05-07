export type HeroVideo = {
  video: { mp4Url: string } | null;
};

export type Property = {
  id: string;
  name: string;
  location: string;
  price: string;
  image: { url: string }[];
};

const DATOCMS_ENDPOINT = "https://graphql.datocms.com/";

async function datocmsQuery<T>(query: string): Promise<T> {
  const res = await fetch(DATOCMS_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.DATOCMS_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
    next: { revalidate: 3600 },
  });

  const json = await res.json();

  if (json.errors) {
    console.error("[DatoCMS]", json.errors[0].message);
    return {} as T;
  }

  return json.data as T;
}

export async function getHeroVideoUrl(): Promise<string | null> {
  const data = await datocmsQuery<{ global: { heroVideo: HeroVideo } | null }>(`
    {
      global {
        heroVideo {
          video { mp4Url(res: high) }
        }
      }
    }
  `);
  return data.global?.heroVideo?.video?.mp4Url ?? null;
}

export async function getLocationImages(): Promise<string[]> {
  const data = await datocmsQuery<{
    global: { locationImages: { url: string }[] } | null;
  }>(`
    {
      global {
        locationImages { url }
      }
    }
  `);
  return (data.global?.locationImages ?? []).map((img) => img.url);
}

export async function getAllProperties(): Promise<Property[]> {
  const data = await datocmsQuery<{ allProperties: Property[] }>(`
    {
      allProperties {
        id
        name
        location
        price
        image { url }
      }
    }
  `);

  return data.allProperties ?? [];
}
