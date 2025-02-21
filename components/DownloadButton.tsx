"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface DownloadButtonProps {
  url: string;
  filename: string;
}

export default function DownloadButton({ url, filename }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setProgress(0);

      // 发起请求并获取响应
      const response = await fetch(url);
      if (!response.ok) throw new Error("下载失败");

      // 获取文件大小
      const contentLength = response.headers.get("X-Content-Length");
      const total = contentLength ? parseInt(contentLength, 10) : 0;

      // 创建可读流
      const reader = response.body?.getReader();
      if (!reader) throw new Error("无法创建下载流");

      // 创建新的 ReadableStream
      const stream = new ReadableStream({
        async start(controller) {
          let loaded = 0;

          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              controller.close();
              break;
            }

            loaded += value.length;
            if (total) {
              // 更新进度
              const percentage = Math.round((loaded / total) * 100);
              setProgress(percentage);
            }

            controller.enqueue(value);
          }
        },
      });

      // 转换流为 Blob
      const blob = await new Response(stream).blob();

      // 创建下载链接
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;

      // 触发下载
      document.body.appendChild(link);
      link.click();

      // 清理
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success("下载完成");
    } catch (error) {
      console.error("下载失败:", error);
      toast.error("下载失败");
    } finally {
      setIsDownloading(false);
      setProgress(0);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={isDownloading}>
      {isDownloading ? `下载中 ${progress}%` : "下载"}
    </Button>
  );
}
