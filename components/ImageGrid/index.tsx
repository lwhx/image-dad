"use client";

import { useGetImages } from "@/features/images/api/use-get-images";
import type { Image as ImageType } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { parseAsInteger, useQueryState } from "nuqs";
import Empty from "../Empty";
import ImageGridSkeleton from "./ImageGridSkeleton";
import Pagination from "./Pagination";
import ViewDialog from "./ViewDialog";
import ConfirmDialog from "../ConfirmDialog";
import { useDeleteImage } from "@/features/images/api/use-delete-image";

export default function ImageGrid() {
  const [pageNo, setPageNo] = useQueryState(
    "pageNo",
    parseAsInteger.withDefault(1)
  );
  const [pageSize] = useQueryState("pageSize", parseAsInteger.withDefault(12));
  const [view, setView] = useQueryState("view");
  const [confirm, setConfirm] = useQueryState("confirm");

  const { data, isLoading } = useGetImages({ pageNo, pageSize });
  const { mutate, isPending } = useDeleteImage({
    onSuccess: () => {
      setConfirm(null);
      setView(null);
    },
  });

  const images = data?.list ?? [];
  const total = data?.total ?? 0;

  // 加载状态
  if (isLoading) {
    return <ImageGridSkeleton />;
  }

  // 空状态
  if (!isLoading && images.length === 0) {
    return (
      <Empty
        title="暂无图片"
        description="点击上传按钮添加图片"
        actionLabel="上传图片"
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-100"
            onClick={() => setView(`${image.id}`)}
          >
            <Image
              src={image.url}
              alt={image.filename}
              fill
              className={cn(
                "object-cover transition-all duration-300",
                "group-hover:scale-105"
              )}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>

      {/* 只有在有数据时才显示分页 */}
      {total > pageSize && (
        <div className="mt-4">
          <Pagination
            currentPage={pageNo}
            totalPages={Math.ceil(total / pageSize)}
            onPageChange={(pageNo) => setPageNo(pageNo)}
          />
        </div>
      )}

      <ViewDialog
        viewDialogOpen={!!view}
        setViewDialogOpen={() => setView(null)}
        selectedImage={
          view ? (images.find((img) => img.id === +view) as ImageType) : null
        }
        setConfirmDialogOpen={() => setConfirm(view)}
      />

      <ConfirmDialog
        open={!!confirm}
        setOpen={() => setConfirm(null)}
        title="确认删除"
        description="确认删除该图片吗？"
        isLoading={isPending}
        onConfirm={() => confirm && mutate({ param: { id: confirm } })}
      />
    </>
  );
}
