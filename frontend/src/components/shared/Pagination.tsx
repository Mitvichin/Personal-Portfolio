import { useState } from 'react';
import { PaginationProps } from '../../types/PaginationProps';
import LeftChevron from '../assets/left-chevron.svg?react';
import RightChevron from '../assets/right-chevron.svg?react';

export const Pagination: React.FC<PaginationProps> = ({
  total,
  onPageChange: onPageChangeProps,
}) => {
  const [currPage, setCurrPage] = useState<number>(1);

  const onPageChange = (direction: number) => {
    const nextPage = currPage + direction;

    if (nextPage === total + 1 || nextPage === 0) return;

    setCurrPage(nextPage);
    onPageChangeProps(nextPage);
  };

  return (
    <div
      className="flex items-center gap-x-1 p-2 justify-center ml-auto"
      aria-label="Pagination"
    >
      <button
        onClick={() => onPageChange(-1)}
        disabled={currPage === 1}
        type="button"
        className="min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        aria-label="Previous"
      >
        <LeftChevron className="shrink-0 size-3.5" />
      </button>
      <div className="flex items-center gap-x-1 cursor-default">
        <span className="min-h-9.5 flex justify-center items-center text-gray-800 py-2 px-1.5 text-sm">
          {currPage}
        </span>
        <span className="min-h-9.5 flex justify-center items-center text-gray-800 py-2 px-1.5 text-sm">
          of
        </span>
        <span className="min-h-9.5 flex justify-center items-center text-gray-800 py-2 px-1.5 text-sm">
          {total}
        </span>
      </div>
      <button
        onClick={() => onPageChange(1)}
        disabled={currPage === total}
        type="button"
        className="min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        aria-label="Next"
      >
        <RightChevron className="shrink-0 size-3.5" />
      </button>
    </div>
  );
};
