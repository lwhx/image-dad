import { z } from "zod";

export const getImagesSchema = z.object({
  pageNo: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(12),
});

const fileSchema = z
  .instanceof(File)
  .refine((file) => /^image\//.test(file.type), {
    message: "Only image files are allowed",
  });

export const uploadSchema = z.object({
  files: z
    .union([fileSchema, z.array(fileSchema)])
    .transform((files) => (Array.isArray(files) ? files : [files]))
    .refine((files) => files.length > 0, {
      message: "At least one file must be uploaded",
    }),
});
