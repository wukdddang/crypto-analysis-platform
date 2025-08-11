"use client";

import { useTransactionDetail } from "../../_context/transaction-detail.context";
import Link from "next/link";

export default function TransactionSummarySection() {
  const { transactionDetail } = useTransactionDetail();

  if (!transactionDetail) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

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
      label: "Confirmations",
      value: transactionDetail.confirmations.toString(),
    },
    {
      label: "Fee",
      value: transactionDetail.fee,
    },
    {
      label: "Date / Time",
      value: transactionDetail.timestamp,
    },
    {
      label: "Total Input",
      value: transactionDetail.totalInput,
    },
    {
      label: "Total Output",
      value: transactionDetail.totalOutput,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
      {/* Header with status */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Transaction Summary
        </h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            transactionDetail.status
          )}`}
        >
          {transactionDetail.status}
        </span>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  );
}
