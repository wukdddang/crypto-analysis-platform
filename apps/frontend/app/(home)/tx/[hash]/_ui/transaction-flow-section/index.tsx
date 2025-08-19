"use client";

import { useTransactionDetail } from "../../_context/transaction-detail.context";
import { Copy } from "lucide-react";
import Link from "next/link";

export default function TransactionFlowSection() {
  const { transactionDetail } = useTransactionDetail();

  if (!transactionDetail) return null;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // TODO: 토스트 메시지 추가
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FROM Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              FROM
            </h3>
            <div className="space-y-3">
              {transactionDetail.inputs?.map((input, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/tx/${input.address}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-mono break-all"
                      >
                        {input.address}
                      </Link>
                      <button
                        onClick={() => copyToClipboard(input.address)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        title="Copy address"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {input.value} BTC ({input.valueUSD || "N/A"} USD)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TO Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              TO
            </h3>
            <div className="space-y-3">
              {transactionDetail.outputs?.map((output, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/tx/${output.address}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-mono break-all"
                      >
                        {output.address}
                      </Link>
                      <button
                        onClick={() => copyToClipboard(output.address)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        title="Copy address"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {output.value} BTC ({output.valueUSD || "N/A"} USD)
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Fee and Total */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Fee:</span>
                <span className="text-gray-900 dark:text-gray-100">
                  {transactionDetail.fee} ({transactionDetail.feeUSD || "N/A"}{" "}
                  USD)
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500 dark:text-gray-400">
                  Total value:
                </span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {transactionDetail.totalOutput} (
                  {transactionDetail.totalOutputUSD || "N/A"} USD)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
