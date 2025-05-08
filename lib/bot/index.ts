import { Bot } from "grammy";
import { createDb } from "../db";
import { images } from "../db/schema";
import { createR2 } from "../oss";
import { generateDateDir, generateRandomString } from "../utils";
import { commandStart, isOwner, replyNotAllowed } from "./utils";

const bot = new Bot(process.env.BOT_TOKEN!);

bot.command("start", async (ctx) => {
  await commandStart(ctx);
});

bot.on(["message:photo", "message:document"], async (ctx) => {
  if (!isOwner(ctx.message!.from.id)) {
    return replyNotAllowed(ctx);
  }

  const file = await ctx.getFile();
  const filePath = file.file_path;
  const fileSize = file.file_size || 0;

  const res = await fetch(
    `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${filePath}`
  );

  if (!res.ok) {
    return ctx.reply("Failed to upload file. Please check your webhook is correct.");
  }

  const fileType = file.file_path?.split(".").pop() || "";
  const fileName = generateRandomString();

  try {
    const db = await createDb();
    const r2 = createR2();

    const key = `${generateDateDir()}/${fileName}.${fileType}`;
    const url = `${process.env.BUCKET_DOMAIN}/${key}`;

    await r2.put(key, await res.arrayBuffer());

    await db.insert(images).values({
      filename: `${fileName}.${fileType}`,
      url,
      key,
      contentType: `image/${fileType}`,
      bytes: fileSize,
    });

    return ctx.reply(`Successfully uploaded image!\nURL: ${url}`);
  } catch (err) {
    console.error(err);
    return ctx.reply("Failed to upload file");
  }
});

export default bot;
