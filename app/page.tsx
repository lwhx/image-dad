import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const runtime = "edge";

export default async function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">图片老豆👨</h1>
      <Image src="/logo.png" alt="Logo" width={96} height={108} />
      <Link href="/app">
        <Button>
          <ArrowRight className="w-4 h-4" />
          开始使用
        </Button>
      </Link>
    </main>
  );
}
