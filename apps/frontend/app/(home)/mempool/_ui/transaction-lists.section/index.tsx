"use client";

import { useMempool } from "../../_context/mempool.context";
import { useState } from "react";
import Link from "next/link";

type FeeCategory = "highFee" | "mediumFee" | "lowFee";

export default function TransactionListsSection() {
  const { transactionLists, loading, error } = useMempool();
  const [activeTab, setActiveTab] = useState<FeeCategory>("highFee");
  const [visibleCount, setVisibleCount] = useState(30);

  if (loading || error || !transactionLists) {
    return null;
  }

  const tabs = [
    {
      key: "highFee" as FeeCategory,
      label: "Highest Fee Transactions",
      color: "text-red-600 dark:text-red-400",
      borderColor: "border-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
    {
      key: "mediumFee" as FeeCategory,
      label: "Oldest Transactions",
      color: "text-yellow-600 dark:text-yellow-400",
      borderColor: "border-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      key: "lowFee" as FeeCategory,
      label: "Largest Transactions",
      color: "text-blue-600 dark:text-blue-400",
      borderColor: "border-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
  ];

  const currentTab = tabs.find((tab) => tab.key === activeTab);
  const currentTransactions = transactionLists[activeTab];
  const visibleTransactions = currentTransactions.slice(0, visibleCount);
  const hasMore = currentTransactions.length > visibleCount;

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {/* 탭 헤더 */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setVisibleCount(30); // 탭 변경 시 표시 개수 초기화
              }}
              className={`flex-1 px-4 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
                activeTab === tab.key
                  ? `${tab.color} ${tab.borderColor}`
                  : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 내용 */}
      <div className="p-6">
        {/* 탭 설명 */}
        <div className="mb-4">
          <div className={`p-3 rounded-lg ${currentTab?.bgColor}`}>
            <h3 className={`font-semibold ${currentTab?.color} mb-1`}>
              {currentTab?.label}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {activeTab === "highFee" &&
                "Transactions with the highest fees paid"}
              {activeTab === "mediumFee" &&
                "Transactions that have been waiting the longest"}
              {activeTab === "lowFee" && "Transactions with the largest size"}
            </p>
          </div>
        </div>

        {/* 트랜잭션 목록 - 2열 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {visibleTransactions.map((tx, index) => (
            <Link
              key={tx.hash}
              href={`/tx/${tx.hash}`}
              className="block border border-gray-200 dark:border-gray-700 rounded p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  {/* 순서 및 해시 */}
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-5">
                      #{index + 1}
                    </span>
                    <span className="text-xs font-mono text-blue-600 dark:text-blue-400">
                      {formatHash(tx.hash)}
                    </span>
                  </div>

                  {/* 트랜잭션 정보 - 가로 배치 */}
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-gray-900 dark:text-white font-medium">
                      Size: {(tx.size / 1000).toFixed(1)}KB
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      I/O: {tx.inputs}/{tx.outputs}
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      Age: {formatTime(tx.age)}
                    </span>
                  </div>
                </div>

                {/* 수수료 정보와 바 */}
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {tx.fee.toFixed(5)} BTC
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {tx.feeRate} sat/vB
                    </div>
                  </div>

                  {/* 수수료 표시 바 - 작게 오른쪽에 */}
                  <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-1 relative group">
                    <div
                      className={`h-1 rounded-full transition-all duration-300 ${
                        activeTab === "highFee"
                          ? "bg-red-500"
                          : activeTab === "mediumFee"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                      style={{
                        width: `${Math.min((tx.feeRate / 50) * 100, 100)}%`,
                      }}
                    ></div>
                    {/* 툴팁 */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                      Fee Rate: {tx.feeRate} sat/vB
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 더보기 버튼 */}
        {hasMore && (
          <div className="mt-6 text-center">
            <button
              onClick={() =>
                setVisibleCount((prev) =>
                  Math.min(prev + 30, currentTransactions.length)
                )
              }
              className="px-6 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              Load More Transactions (
              {currentTransactions.length - visibleCount} more)
            </button>
          </div>
        )}

        {/* 현재 보여지는 트랜잭션 수 정보 */}
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Showing {visibleTransactions.length} of {currentTransactions.length}{" "}
          transactions
        </div>
      </div>
    </div>
  );
}
