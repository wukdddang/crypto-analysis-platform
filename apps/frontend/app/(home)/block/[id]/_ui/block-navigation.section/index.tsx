"use client";

import { useBlockDetail } from "../../_context/block-detail.context";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function BlockNavigationSection() {
  const { blockDetail } = useBlockDetail();

  if (!blockDetail) return null;

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Previous Block */}
      <div className="flex-1">
        {blockDetail.prevBlock ? (
          <Link
            href={`/block/${blockDetail.prevBlock}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous Block
          </Link>
        ) : (
          <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg cursor-not-allowed">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous Block
          </span>
        )}
      </div>

      {/* Current Block Info */}
      <div className="flex-2 text-center mx-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Block Height
        </div>
        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
          {blockDetail.height}
        </div>
      </div>

      {/* Next Block */}
      <div className="flex-1 text-right">
        {blockDetail.nextBlock ? (
          <Link
            href={`/block/${blockDetail.nextBlock}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Next Block
            <ChevronRight className="h-4 w-4 ml-2" />
          </Link>
        ) : (
          <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg cursor-not-allowed">
            Next Block
            <ChevronRight className="h-4 w-4 ml-2" />
          </span>
        )}
      </div>
    </div>
  );
}
