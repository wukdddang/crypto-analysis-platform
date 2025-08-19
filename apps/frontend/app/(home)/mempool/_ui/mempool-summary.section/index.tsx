"use client";

import { useMempool } from "../../_context/mempool.context";

export default function MempoolSummarySection() {
  const { summary, loading, error } = useMempool();

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-gray-200 dark:bg-gray-700 rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div className="text-red-600 dark:text-red-400">
          <h3 className="font-semibold mb-2">데이터 로딩 오류</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1 text-sm">
              <p className="text-blue-800 dark:text-blue-200 mb-2">
                <strong>
                  The following information is a real-time summary of
                  transactions in your node's mempool.
                </strong>{" "}
                These are unconfirmed transactions that have been broadcast to
                the network.
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                This real-time summary data can be helpful for anything that is
                temporarily storing or a transaction included in a future block
                depending on the priority.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* 트랜잭션 수 */}
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
            {summary.transactionCount.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            TRANSACTIONS
          </div>
        </div>

        {/* 블록 수 */}
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
            {summary.totalSize}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            BLOCKS
          </div>
        </div>

        {/* 총 수수료 */}
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="mb-1">
            <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {summary.feeRange.min.toFixed(4)}{" "}
            </span>
            <span className="text-sm font-normal text-purple-400 dark:text-purple-300">
              {Math.floor(Math.random() * 9999)}{" "}
            </span>
            <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
              BTC
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            TOTAL FEES
          </div>
        </div>

        {/* 평균 수수료 */}
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="mb-1">
            <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
              {summary.feeRange.max.toFixed(4)}{" "}
            </span>
            <span className="text-sm font-normal text-orange-400 dark:text-orange-300">
              {Math.floor(Math.random() * 9999)}{" "}
            </span>
            <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
              BTC
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            AVG FEE
          </div>
        </div>

        {/* 평균 수수료율 */}
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
            {summary.estimatedWaitTime.nextBlock.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            AVG FEE RATE <span className="text-xs">(sat/vB)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
