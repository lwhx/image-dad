import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center mt-4 space-x-2">
      <Button
        variant={currentPage === 1 ? "outline" : "default"}
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        <ChevronLeft />
        上一页
      </Button>
      <span className="flex items-center">
        {currentPage} / {totalPages}
      </span>
      <Button
        variant={currentPage === totalPages ? "outline" : "default"}
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        <ChevronRight />
        下一页
      </Button>
    </div>
  );
}
