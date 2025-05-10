import { createDb } from "@/lib/db";
import { images } from "@/lib/db/schema";
import { createR2 } from "@/lib/oss";
import { generateDateDir, generateRandomString } from "@/lib/utils";
import { eq } from "drizzle-orm";

export async function getImage(id: number) {
  "use server";

  const db = await createDb();
  const image = await db.query.images.findFirst({
    where: eq(images.id, id),
  });

  if (!image) {
    throw new Error("图片不存在");
  }

  const r2 = await createR2();
  const object = await r2.get(image.key);

  if (!object) {
    throw new Error("图片不存在");
  }

  return { object, image };
}

export async function getImages(pageNo: number, pageSize: number) {
  "use server";

  const db = await createDb();
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

export const uploadImages = async (files: File[], userId: string) => {
  "use server";

  const db = await createDb();
  const r2 = await createR2();

  const uploadR2Promises = files.map(async (file) => {
    const key = `${generateDateDir()}/${generateRandomString()}.${
      file.type.split("/")[1]
    }`;
    const url = `${process.env.BUCKET_DOMAIN}/${key}`;

    await r2.put(key, file);

    await db.insert(images).values({
      filename: file.name,
      url,
      key,
      contentType: file.type,
      bytes: file.size,
      userId,
    });

    return { url, key };
  });

  return await Promise.all(uploadR2Promises);
};

export async function deleteImage(id: number) {
  "use server";

  try {
    const db = await createDb();
    const r2 = await createR2();

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
