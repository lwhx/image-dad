import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";

interface DownloadButtonProps {
  id: number;
  filename: string;
}

export default function DownloadButton({ id, filename }: DownloadButtonProps) {
  return (
    <Button variant="outline" asChild>
      <a
        href={`/api/images/${id}`}
        download={filename}
        target="_blank"
        rel="noopener noreferrer"
      >
        <DownloadIcon className="h-4 w-4" />
        下载 {filename}
      </a>
    </Button>
  );
}
