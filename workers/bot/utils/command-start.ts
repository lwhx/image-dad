import { Context } from "grammy";

export async function commandStart(ctx: Context) {
  return ctx.reply(
    "欢迎使用图片老豆👴！\n\n直接发送图片即可上传（会压缩）\n发送文件即可原图上传"
  );
}
