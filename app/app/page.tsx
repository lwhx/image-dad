import ImageGrid from "@/components/ImageGrid";
import TokenButton from "@/features/auth/components/TokenButton";
import UploadButton from "@/features/images/components/UploadButton";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export const runtime = "edge";

export default async function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* 头部区域 */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <h1 className="text-3xl font-bold tracking-tight">图片库</h1>
          </Link>
          <div className="flex items-center gap-4">
            <UploadButton />
            <TokenButton />
            <div className="w-7 h-7 flex justify-items-center">
              <UserButton />
            </div>
          </div>
        </div>
        {/* 图片网格 */}
        <ImageGrid />
      </div>
    </main>
  );
}
