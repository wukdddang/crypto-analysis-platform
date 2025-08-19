"use client";

import { useTransactionDetail } from "../../_context/transaction-detail.context";
import Link from "next/link";
import { Download } from "lucide-react";

export default function TransactionSummarySection() {
  const { transactionDetail } = useTransactionDetail();

  if (!transactionDetail) return null;

  const summaryItems = [
    {
      label: "Amount Transacted",
      value: transactionDetail.totalOutput,
      highlight: true,
    },
    {
      label: "Included in block",
      value: transactionDetail.blockHeight,
      link: `/block/${transactionDetail.blockHeight}`,
    },
    {
      label: "Fee",
      value: transactionDetail.fee,
    },
    {
      label: "Confirmations",
      value: transactionDetail.confirmations.toString(),
    },
    {
      label: "Size",
      value: `${transactionDetail.size || 0} bytes`,
    },
    {
      label: "Date/Time",
      value: transactionDetail.timestamp,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Summary Box */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {summaryItems.map((item, index) => (
                <div key={index} className="space-y-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {item.label}
                  </dt>
                  <dd
                    className={`text-sm font-mono ${
                      item.highlight
                        ? "text-lg font-bold text-blue-600 dark:text-blue-400"
                        : "text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    {item.link ? (
                      <Link
                        href={item.link}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                      >
                        {item.value}
                      </Link>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3 min-w-[200px]">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Buy
            </button>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Exchange
            </button>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Gaming
            </button>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Earn Crypto
            </button>

            {/* Download and API buttons */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Download Transaction Receipts</span>
                <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                  .PDF
                </span>
              </button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors mt-2">
                API for this data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
