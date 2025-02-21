import { Bot } from "grammy";
import { Env } from "../types";
import { generateDateDir } from "@/lib/utils";
import { InsertDB } from "./insert-db";
import { StoreFile } from "./store-file";
import { isOwner } from "./is-owner";

export function createPhotoListen(bot: Bot, env: Env) {
  bot.on(["message:photo", "message:document"], async (ctx) => {
    if (!isOwner(env, ctx)) {
      return ctx.reply("You are not allowed to upload.");
    }

    const file = await ctx.getFile();
    const filename = file.file_unique_id;
    const filePath = file.file_path;
    const fileSize = file.file_size || 0;

    const res = await fetch(
      `https://api.telegram.org/file/bot${env.BOT_TOKEN}/${filePath}`
    );

    if (!res.ok) {
      return ctx.reply("Failed to upload file");
    }

    const fileType = file.file_path?.split(".").pop() || "";

    try {
      const key = `${generateDateDir()}/${filename}.${fileType}`;
      const url = `${env.BUCKET_DOMAIN}/${key}`;

      await InsertDB(env, { filename, fileType, fileSize, key, url });
      await StoreFile(env, {
        key,
        fileType,
        arrayBuffer: await res.arrayBuffer(),
      });

      return ctx.reply(
        `Successfully uploaded image!\nURL: ${env.BUCKET_DOMAIN}/${key}`
      );
    } catch (err) {
      console.error(err);
      return ctx.reply("Failed to upload file");
    }
  });
}
