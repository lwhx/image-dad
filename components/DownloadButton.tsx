import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
  id: number;
  filename: string;
}

export default function DownloadButton({ id, filename }: DownloadButtonProps) {
  return (
    <Button asChild>
      <a href={`/api/images/${id}`} download={filename}>
        下载 {filename}
      </a>
    </Button>
  );
}
