import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { deleteImage, getImages, uploadImages } from "../actions";
import { getImagesSchema, uploadSchema } from "../schemas";

const app = new Hono()
  .get("/", zValidator("query", getImagesSchema), async (c) => {
    const { pageNo, pageSize } = c.req.valid("query");
    const images = await getImages(pageNo, pageSize);

    return c.json({ data: images });
  })
  .post(
    "/upload",
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

      if (files && files.length > 0) {
        const response = await uploadImages(files);

        return c.json({ data: response });
      } else {
        return c.json({ error: "No files received" }, 400);
      }
    }
  )
  .delete("/:id", async (c) => {
    const { id } = c.req.param();

    await deleteImage(+id);

    return c.json({ data: id });
  });

export default app;
