import { Env } from "../types";

interface InsertOptions {
  filename: string;
  fileType: string;
  fileSize: number;
  key: string;
  url: string;
}

export async function InsertDB(
  env: Env,
  { filename, fileType, fileSize, key, url }: InsertOptions
) {
  await env.DB.prepare(
    `INSERT INTO images (filename, key, url, content_type, bytes, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(
      `${filename}.${fileType}`,
      key,
      url,
      `image/${fileType}`,
      fileSize,
      Math.floor(Date.now() / 1000)
    )
    .run();
}
