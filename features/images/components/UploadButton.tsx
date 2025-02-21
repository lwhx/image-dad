"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { useUploadImages } from "../api/use-upload-images";

export default function UploadButton() {
  const { mutate, isPending } = useUploadImages();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;

    const files = Array.from(e.target.files);

    mutate({ files });
  }

  return (
    <>
      <input
        id="upload-input"
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleUpload}
        disabled={isPending}
      />
      <Button disabled={isPending} className="flex items-center justify-center">
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {/* <span className="text-sm">{`${totalProgress}%`}</span> */}
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            <label htmlFor="upload-input" className="cursor-pointer">
              上传图片
            </label>
          </>
        )}
      </Button>
    </>
  );
}
