import Link from "next/link";
import { redirect } from "next/navigation";

import ImageGrid from "@/components/ImageGrid";
import SignoutButton from "@/components/SignoutButton";
import UploadButton from "@/features/images/components/UploadButton";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

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
            <SignoutButton />
          </div>
        </div>
        {/* 图片网格 */}
        <ImageGrid />
      </div>
    </main>
  );
}
