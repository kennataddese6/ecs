import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  const prevUrl = `${baseUrl}?page=${currentPage - 1}`;
  const nextUrl = `${baseUrl}?page=${currentPage + 1}`;

  return (
    <div className="flex items-center justify-center space-x-2 my-8">
      <Button variant="outline" size="sm" disabled={currentPage <= 1} asChild={currentPage > 1}>
        {currentPage > 1 ? (
          <Link href={prevUrl}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Link>
        ) : (
          <span>
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </span>
        )}
      </Button>

      <span className="text-sm font-medium text-muted-foreground px-2">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        asChild={currentPage < totalPages}
      >
        {currentPage < totalPages ? (
          <Link href={nextUrl}>
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        ) : (
          <span>
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </span>
        )}
      </Button>
    </div>
  );
}
