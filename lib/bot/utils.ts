import { Context } from "grammy";

export const isOwner = (fromId?: number) => {
  if (!fromId) {
    return false;
  }

  const ownerIds = process.env.BOT_OWNERS_ID!.split(",").map((item) => +item);

  return ownerIds.includes(fromId);
};

export const commandStart = async (ctx: Context) => {
  const isAllow = isOwner(ctx.from?.id);

  if (!isAllow) {
    return replyNotAllowed(ctx);
  }

  return ctx.reply(
    "欢迎使用图片老豆👨！\n\n直接发送图片即可上传（会压缩）\n发送文件即可原图上传"
  );
};

export const replyNotAllowed = (ctx: Context) => {
  return ctx.reply(
    "You are *not allowed* to use\\. Please contact the owner or [deploy your own bot](https://github.com/sdrpsps/image-dad)\\.",
    { parse_mode: "MarkdownV2" }
  );
};
