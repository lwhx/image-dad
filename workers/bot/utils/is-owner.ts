import { Context } from "grammy";
import { Env } from "../types";

export function isOwner(env: Env, ctx: Context) {
  const fromId = ctx.message!.from.id;
  const ownerIds = env.BOT_OWNERS_ID.split(",").map((item) => +item);

  if (!ownerIds || ownerIds.length < 1) {
    return false;
  }

  return ownerIds.includes(fromId);
}
