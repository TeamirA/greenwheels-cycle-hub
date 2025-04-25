
import React from 'react';
import { Button } from './button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

export const CustomPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}) => {
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);
  const indexOfFirstItem = indexOfLastItem - Math.min(itemsPerPage, indexOfLastItem - (currentPage - 1) * itemsPerPage);

  return (
    <div className="flex justify-between items-center mt-4 dark:text-gray-300">
      <div className="text-sm text-graydark dark:text-gray-400">
        Showing {indexOfFirstItem + 1} to {indexOfLastItem} of {totalItems} items
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className={currentPage === page ? 
              "bg-greenprimary hover:bg-greenprimary/80" : 
              "dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"}
          >
            {page}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
