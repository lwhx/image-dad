import { getCloudflareContext } from "@opennextjs/cloudflare";
import { cache } from "react";

export const createR2 = cache(async () => {
  const { env } = await getCloudflareContext({ async: true });
  return env.R2;
});
