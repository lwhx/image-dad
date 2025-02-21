import { getRequestContext } from "@cloudflare/next-on-pages";

export const createR2 = () => getRequestContext().env.R2;

