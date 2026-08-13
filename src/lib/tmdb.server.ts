const BASE = "https://api.themoviedb.org/3";

export class MetadataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MetadataError";
  }
}

/**
 * Calls the TMDB metadata API. Supports both v4 read-access tokens (Bearer)
 * and classic v3 API keys. The key is read per-request: env is injected at
 * request time on the edge runtime.
 */
export async function tmdbRequest<T>(
  path: string,
  params: Record<string, string> = {},
): Promise<T> {
  const key = process.env["TMDB_API_KEY"];
  if (!key) throw new MetadataError("The metadata service is not configured.");

  const url = new URL(BASE + path);
  url.searchParams.set("language", "en-US");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const headers: Record<string, string> = { accept: "application/json" };
  const isBearer = key.length > 60 || key.startsWith("ey");
  if (isBearer) headers["Authorization"] = `Bearer ${key}`;
  else url.searchParams.set("api_key", key);

  let response: Response;
  try {
    response = await fetch(url.toString(), { headers });
  } catch {
    throw new MetadataError("Could not reach the metadata service.");
  }

  if (!response.ok) {
    if (response.status === 401) throw new MetadataError("The metadata API key was rejected.");
    if (response.status === 404) throw new MetadataError("That title could not be found.");
    if (response.status === 429) throw new MetadataError("Too many requests — try again shortly.");
    throw new MetadataError("The metadata service is temporarily unavailable.");
  }

  return (await response.json()) as T;
}
