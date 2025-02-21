import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyProps {
  title: string;
  description: string;
  onActionClick?: () => void;
  actionLabel?: string;
}

export default function Empty({
  title,
  description,
  onActionClick,
  actionLabel,
}: EmptyProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16")}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      </div>
      {onActionClick && actionLabel && (
        <Button
          onClick={onActionClick}
          className="mt-6"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
