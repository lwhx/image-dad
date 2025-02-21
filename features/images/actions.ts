import { createDb } from "@/lib/db";
import { images } from "@/lib/db/schema";
import { createR2 } from "@/lib/oss";
import { generateDateDir, generateRandomString } from "@/lib/utils";
import { eq } from "drizzle-orm";

export const runtime = "edge";

export async function getImages(pageNo: number, pageSize: number) {
  "use server";

  const db = createDb();
  const [list, total] = await Promise.all([
    db.query.images.findMany({
      offset: (pageNo - 1) * pageSize,
      limit: pageSize,
      orderBy: (images, { desc }) => [desc(images.createdAt)],
    }),
    db.$count(images),
  ]);

  return {
    list,
    total,
  };
}

export const uploadImages = async (files: File[]) => {
  "use server";

  const db = createDb();
  const r2 = createR2();

  const uploadR2Promises = files.map(async (file) => {
    const key = `${generateDateDir()}/${generateRandomString()}.${file.type.split('/')[1]}`;
    const url =
      process.env.NODE_ENV === "development"
        ? `http://localhost:8787/${key}`
        : `${process.env.BUCKET_DOMAIN}/${key}`;

    await r2.put(key, file, {
      httpMetadata: {
        contentType: file.type,
      },
    });

    await db.insert(images).values({
      filename: file.name,
      url,
      key,
      contentType: file.type,
      bytes: file.size,
    });

    return { url, key };
  });

  return await Promise.all(uploadR2Promises);
};

export async function deleteImage(id: number) {
  "use server";

  try {
    const db = createDb();
    const r2 = createR2();

    const image = await db.query.images.findFirst({
      where: eq(images.id, id),
    });
    if (!image) {
      throw new Error("图片不存在");
    }

    const key = image.url.replace(process.env.BUCKET_DOMAIN!, "");
    await r2.delete(key);
    await db.delete(images).where(eq(images.id, id));
  } catch (error) {
    console.error("删除失败", error);
    throw error;
  }
}
