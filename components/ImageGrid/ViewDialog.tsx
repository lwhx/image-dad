import { CopyButton } from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ResponseType as ImageType } from "@/features/images/api/use-get-images";

import DownloadButton from "../DownloadButton";
import MyImage from "../MyImage";

interface ViewDialogProps {
  viewDialogOpen: boolean;
  setViewDialogOpen: () => void;
  selectedImage?: ImageType["list"][number];
  setConfirmDialogOpen: () => void;
}

export default function ViewDialog({
  viewDialogOpen,
  setViewDialogOpen,
  selectedImage,
  setConfirmDialogOpen,
}: ViewDialogProps) {
  return (
    <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{selectedImage?.filename}</DialogTitle>
          <DialogDescription className="flex items-center gap-x-2">
            {selectedImage?.url}
            <CopyButton text={selectedImage?.url ?? ""} />
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-auto">
          {selectedImage && (
            <MyImage src={selectedImage.url} alt={selectedImage.filename} />
          )}
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={setConfirmDialogOpen}>
            删除
          </Button>
          {selectedImage && (
            <DownloadButton
              id={selectedImage.id}
              filename={selectedImage.filename}
            />
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
