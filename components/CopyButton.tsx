import { useCopy } from "@/hooks/use-copy";
import { Copy } from "lucide-react";

export function CopyButton({ text }: { text: string }) {
  const { copy } = useCopy();

  return <Copy className="size-4 cursor-pointer" onClick={() => copy(text)} />;
}
