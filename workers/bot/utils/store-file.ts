import { Env } from "../types";

interface StoreOptions {
  key: string;
  fileType: string;
  arrayBuffer: ArrayBuffer;
}
export async function StoreFile(
  env: Env,
  { key, arrayBuffer, fileType }: StoreOptions
) {
  await env.R2.put(key, arrayBuffer, {
    httpMetadata: {
      contentType: `image/${fileType}`,
    },
  });
}
