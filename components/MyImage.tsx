"use client";

import { useState } from "react";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";

export default function MyImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(true);
  const [aspectRatio, setAspectRatio] = useState<number>(1);

  return (
    <div 
      className="relative w-full"
      style={{ aspectRatio }}
    >
      {loading && <Skeleton className="w-full h-full rounded-lg" />}
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        onLoad={(e) => {
          // 获取图片的原始宽高比
          const img = e.target as HTMLImageElement;
          setAspectRatio(img.naturalWidth / img.naturalHeight);
          setLoading(false);
        }}
      />
    </div>
  );
}
