"use client";

import { useTransactionDetail } from "../../_context/transaction-detail.context";
import { Copy } from "lucide-react";

export default function TransactionHashSection() {
  const { transactionDetail } = useTransactionDetail();

  if (!transactionDetail) return null;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transactionDetail.hash);
      // TODO: 토스트 메시지 추가
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex items-center space-x-4">
        {/* Bitcoin Logo */}
        <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zM17.25 13.28c-.125-.578-.537-1.317-1.883-1.317-.537 0-1.077.125-1.883.5l-.25-.5c.25-.125.5-.25.75-.375.75-.25 1.5-.375 2.25-.375 1.883 0 2.75.75 3.125 1.5.375.75.5 1.75.25 2.75-.125.75-.5 1.5-1.125 2.125-.625.625-1.375 1.125-2.125 1.5-.75.375-1.5.5-2.25.5-.5 0-1-.125-1.5-.25l-.25.5c.5.25 1 .375 1.5.375 1.25 0 2.25-.375 2.75-.75.5-.375.75-.875.875-1.375.125-.5.125-1 0-1.5z" />
          </svg>
        </div>

        {/* Transaction Hash */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            TRANSACTION HASH ID
          </h2>
          <div className="flex items-center space-x-2">
            <code className="text-sm font-mono text-gray-700 dark:text-gray-300 break-all">
              {transactionDetail.hash}
            </code>
            <button
              onClick={copyToClipboard}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              title="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
