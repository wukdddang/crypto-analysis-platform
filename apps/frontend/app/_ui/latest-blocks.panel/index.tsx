"use client";

import { Copy } from "lucide-react";
import { useBitcoinExplorer } from "../../_context/bitcoin-explorer.context";
import PaginationComponent from "../pagination.component";

export default function LatestBlocksPanel() {
  const { blocksData, loading, error, 페이지를_변경_한다 } =
    useBitcoinExplorer();

  const handlePageChange = (page: number) => {
    페이지를_변경_한다(page);
  };

  if (loading) {
    return (
      <div className="w-full px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!blocksData) return null;

  return (
    <div className="w-full px-4 py-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors">
                Latest Blocks
              </button>
              <button className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                Latest Recent Transactions
              </button>
            </div>
            <a
              href="#"
              className="text-blue-600 dark:text-blue-400 text-sm hover:underline transition-colors"
            >
              All for this data
            </a>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-colors">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 transition-colors">
                  <tr className="text-left text-sm text-gray-600 dark:text-gray-300">
                    <th className="px-6 py-3 font-medium">Hash</th>
                    <th className="px-6 py-3 font-medium">Block Height</th>
                    <th className="px-6 py-3 font-medium">
                      Block Size (Bytes)
                    </th>
                    <th className="px-6 py-3 font-medium">Transactions</th>
                    <th className="px-6 py-3 font-medium">Block Reward</th>
                    <th className="px-6 py-3 font-medium">Mined Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {blocksData.data.map((block, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <a
                            href="#"
                            className="text-blue-600 dark:text-blue-400 hover:underline font-mono text-sm transition-colors"
                          >
                            {block.hash}
                          </a>
                          <Copy className="h-4 w-4 text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href="#"
                          className="text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                        >
                          {block.height}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {block.size}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {block.transactions}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {block.reward}
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          BLOCK REWARD
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {block.time}
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {block.ago}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 페이지네이션 */}
          <div className="mt-6 flex justify-center">
            <PaginationComponent
              currentPage={blocksData.currentPage}
              totalPages={blocksData.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
