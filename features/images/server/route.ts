import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { sessionMiddleware } from "@/lib/session-middleware";

import { deleteImage, getImage, getImages, uploadImages } from "../actions";
import { getImagesSchema, uploadSchema } from "../schemas";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", getImagesSchema),
    async (c) => {
      const { pageNo, pageSize } = c.req.valid("query");
      const images = await getImages(pageNo, pageSize);

      return c.json({ data: images });
    }
  )
  .post(
    "/upload",
    sessionMiddleware,
    zValidator("form", uploadSchema, (result, c) => {
      if (!result.success) {
        return c.json(
          { error: result.error.issues.map((issue) => issue.message).join() },
          400
        );
      }
    }),
    async (c) => {
      const form = c.req.valid("form");
      const files = form["files"];
      const user = c.get("user");

      if (files && files.length > 0) {
        const response = await uploadImages(files, user.id);

        return c.json({ data: response });
      } else {
        return c.json({ error: "No files received" }, 400);
      }
    }
  )
  .get("/:id", sessionMiddleware, async (c) => {
    const { id } = c.req.param();

    const { object, image } = await getImage(id);

    c.header("Content-Type", image.contentType);
    c.header("Content-Disposition", `attachment; filename="${image.filename}"`);
    c.header("Content-Length", object.size.toString());
    c.header("Accept-Ranges", "bytes");
    c.header("Cache-Control", "public, max-age=31536000, immutable");
    c.header("Last-Modified", image.createdAt?.toUTCString());

    return c.body(object.body);
  })
  .delete("/:id", sessionMiddleware, async (c) => {
    const { id } = c.req.param();

    await deleteImage(id);

    return c.json({ data: id });
  });

export default app;
